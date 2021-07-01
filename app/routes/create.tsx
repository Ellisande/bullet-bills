import { LinksFunction, MetaFunction } from "@remix-run/react/routeModules";
import { ActionFunction, redirect } from "remix";
import { prisma } from "../prisma.server";
import stylesUrl from "../styles/create.css";

export let meta: MetaFunction = () => {
  return {
    title: "Bullet Bills",
    description: "Track your bills!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const body = Object.fromEntries(new URLSearchParams(await request.text()));
  const amount = Number(body.amount);
  const dueDate = new Date(body.dueDate);
  const name = String(body.name);
  const site = String(body.site);
  await prisma.bill.create({
    data: {
      name,
      amount,
      site,
      dueDate,
    },
  });
  return redirect("/");
};

export default function Create() {
  return (
    <form method="post" className="layout">
      <fieldset>
        <label htmlFor="name">Name</label>
        <input name="name" id="name" type="text" required />
      </fieldset>
      <fieldset>
        <label htmlFor="amount">Amount</label>
        <input name="amount" id="amount" type="number" required min={1} />
      </fieldset>
      <fieldset>
        <label htmlFor="site">Site</label>
        <input name="site" id="site" type="text" required />
      </fieldset>
      <fieldset>
        <label htmlFor="frequency">Frequency</label>
        <select name="frequency" id="frequency">
          <option value="monthly">Monthly</option>
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="dueDate">Due Date</label>
        <input name="dueDate" id="dueDate" type="date" required />
      </fieldset>
      <button type="submit" className="button confirm">
        Create Bill
      </button>
    </form>
  );
}
