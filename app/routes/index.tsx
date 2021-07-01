import { Bill } from "@prisma/client";
import { addMonths, formatDistance, subDays } from "date-fns";
import { sortBy } from "lodash";
import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  Form,
  Link,
  ActionFunction,
  redirect,
} from "remix";
import { useRouteData } from "remix";
import { prisma } from "../prisma.server";

import stylesUrl from "../styles/index.css";

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
  const method = request.method.toLowerCase();
  const body = Object.fromEntries(new URLSearchParams(await request.text()));
  const id = Number(body.id);
  if (method == "put") {
    const oldBill = await prisma.bill.update({
      where: {
        id,
      },
      data: {
        paid: true,
        paidAt: new Date(),
      },
    });
    if (!oldBill) {
      return redirect("/");
    }
    const oldDueDate = oldBill.dueDate;
    const newDueDate = addMonths(new Date(oldDueDate), 1);
    await prisma.bill.create({
      data: {
        name: oldBill.name,
        site: oldBill.site,
        amount: oldBill.amount,
        dueDate: newDueDate,
      },
    });
  }
  if (method == "delete") {
    await prisma.bill.delete({ where: { id } });
  }
  return redirect("/");
};

export let loader: LoaderFunction = async () => {
  const upcomingBills = await prisma.bill.findMany({
    where: {
      paid: false,
    },
  });
  const recentlyPaidBills = await prisma.bill.findMany({
    where: {
      paid: true,
      paidAt: {
        gte: subDays(new Date(), 3),
      },
    },
  });
  const bills = sortBy(
    [...upcomingBills, ...recentlyPaidBills],
    ["paidAt", "dueDate"]
  );
  return { bills: bills, upcomingBills, recentlyPaidBills };
};

const BillRow = (props: { bill: Bill; type: "upcoming" | "paid" }) => {
  const { bill, type } = props;
  return (
    <div className={`bill-layout ${type}`}>
      <a href={bill.site} target="_blank">
        {bill.name}
      </a>
      {bill.paidAt && (
        <div className="bill-due">
          Paid <span>{formatDistance(new Date(bill.paidAt), new Date())}</span>{" "}
          ago
        </div>
      )}
      {!bill.paid && (
        <div className="bill-due">
          Due in{" "}
          <span>{formatDistance(new Date(bill.dueDate), new Date())}</span>
        </div>
      )}

      <div className="bill-actions">
        {bill.paid && (
          <form>
            <button className="button" disabled>
              Paid
            </button>
          </form>
        )}
        {!bill.paid && (
          <>
            <Form method="put">
              <input type="hidden" name="id" value={bill.id} />
              <button type="submit" className="button confirm">
                Pay ${bill.amount}
              </button>
            </Form>

            <Form method="delete">
              <input type="hidden" name="id" value={bill.id} />
              <button type="submit" className="button cancel">
                X
              </button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default function Index() {
  let { bills, upcomingBills, recentlyPaidBills } = useRouteData();

  return (
    <div className="layout">
      <Link to="/create" className="create-link button confirm">
        Create a New Bill
      </Link>
      <div className="bill-list upcoming">
        <h3>Upcoming Bills</h3>
        {upcomingBills.map((bill: Bill) => (
          <BillRow bill={bill} key={bill.id} type="upcoming" />
        ))}
      </div>
      <div className="bill-list paid">
        <h3>Recently Paid</h3>
        {recentlyPaidBills.map((bill: Bill) => (
          <BillRow bill={bill} key={bill.id} type="paid" />
        ))}
      </div>
    </div>
  );
}
