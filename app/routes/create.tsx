import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "remix";
import { useRouteData } from "remix";

import stylesUrl from "../styles/create.css";
import { prisma } from "../prisma.server";
import { Bill } from "@prisma/client";

export let meta: MetaFunction = () => {
  return {
    title: "Bill Creation",
    description: "Oh no! You have a new bill, make it here!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let action: ActionFunction = async ({ request }) => {
  let body = Object.fromEntries(new URLSearchParams(await request.text()));
  const name = body.name;
  const amount = Number(body.amount);
  const site = body.site;
  const dueDate = new Date(body.dueDate);
  const frequency = body.frequency;

  await prisma().bill.create({
    data: {
      name: name,
      site,
      amount,
      dueDate,
      frequency,
    },
  });
  return redirect("/");
};

export default function Index() {
  return (
    <form method="post" className="bill-create">
      <fieldset className="bill-name">
        <label htmlFor="name">Bill Name</label>
        <input type="text" name="name" id="name" />
      </fieldset>
      <fieldset className="bill-amount">
        <label htmlFor="amount">Amount</label>
        <input type="number" name="amount" id="amount" />
      </fieldset>
      <fieldset className="bill-site">
        <label htmlFor="site">Website</label>
        <input type="text" name="site" id="site" />
      </fieldset>
      <fieldset className="bill-due">
        <label htmlFor="dueDate">Due Date</label>
        <input type="date" name="dueDate" id="dueDate" />
      </fieldset>
      <fieldset className="bill-frequency">
        <label htmlFor="frequency">Frequency</label>
        <select name="frequency" id="frequency">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </fieldset>
      <div className="bill-create-action">
        <button type="submit" className="bill-button create">
          Create Bill
        </button>
      </div>
    </form>
  );
}
