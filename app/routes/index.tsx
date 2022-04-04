import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  ActionFunction,
  redirect,
  Link,
  Form,
} from "remix";
import { useRouteData } from "remix";
import { format, formatDistance, addMonths, addYears, subDays } from "date-fns";
import { sortBy } from "lodash";

import stylesUrl from "../styles/index.css";
import { prisma } from "../prisma.server";
import { Bill } from "@prisma/client";

export let meta: MetaFunction = () => {
  return {
    title: "Bullet Bills",
    description: "Pay your bills!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  const unpaidBills = await prisma().bill.findMany({
    where: {
      paid: false,
      deleted: false,
    },
  });

  const recentlyPaidBills = await prisma().bill.findMany({
    where: {
      paid: true,
      dueDate: {
        gte: subDays(new Date(), 3),
      },
      deleted: false,
    },
  });

  const allBills = sortBy([...unpaidBills, ...recentlyPaidBills], "dueDate");
  return { allBills };
};

export let action: ActionFunction = async ({ request }) => {
  const body = Object.fromEntries(new URLSearchParams(await request.text()));
  const id = Number(body.id);
  if (request.method.toLowerCase() == "put") {
    const oldBill = await prisma().bill.update({
      where: { id },
      data: { paid: true },
    });

    const originalDueDate = new Date(oldBill.dueDate);
    const frequency = oldBill.frequency;

    const newDueDate =
      frequency == "yearly"
        ? addYears(originalDueDate, 1)
        : addMonths(originalDueDate, 1);

    await prisma().bill.create({
      data: {
        name: oldBill.name,
        site: oldBill.site,
        amount: oldBill.amount,
        frequency,
        dueDate: newDueDate,
      },
    });
  }
  if (request.method.toLowerCase() == "delete") {
    await prisma().bill.update({
      where: { id },
      data: { deleted: true },
    });
  }

  return redirect("/");
};

function Bill(props: any) {
  const bill: Bill = props.bill;
  return (
    <div className="bill">
      <div className="bill-name">
        <a href={bill.site}>{bill.name}</a>
      </div>
      <div className="bill-due">
        Due{" "}
        {formatDistance(new Date(bill.dueDate), new Date(), {
          addSuffix: true,
        })}
      </div>
      {bill.paid && (
        <div className="bill-actions">
          <button disabled className="bill-button">
            Paid
          </button>
        </div>
      )}
      {!bill.paid && (
        <div className="bill-actions">
          <Form method="put" className="bill-pay-form">
            <input type="hidden" name="id" value={bill.id} />
            <button className="bill-button pay" type="submit">
              Pay ${bill.amount}
            </button>
          </Form>
          <Form method="delete" className="bill-delete">
            <input type="hidden" name="id" value={bill.id} />
            <button className="bill-button delete">X</button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  let { allBills } = useRouteData();

  return (
    <div className="layout">
      <Link to="/create">Add A New Bill</Link>
      <div className="bill-list">
        {allBills.map((bill: any) => (
          <Bill bill={bill} key={bill.id} />
        ))}
      </div>
    </div>
  );
}
