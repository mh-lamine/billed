/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import store from "../__mocks__/store.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const chrono = (a, b) => new Date(a) - new Date(b);
      const datesSorted = [...dates].sort(chrono);

      expect(dates).toEqual(datesSorted);
    });

    test("The newBill button should be clickable", async () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillsInstance = new Bills({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });

      const buttonNewBill = screen.getByTestId("btn-new-bill");
      buttonNewBill.addEventListener(
        "click",
        newBillsInstance.handleClickNewBill
      );

      fireEvent.click(buttonNewBill);
      await waitFor(() =>
        expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
      );
    });

    test("The eye icon should trigger modal display", async () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillsInstance = new Bills({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });

      $.fn.modal = jest.fn();

      const iconEye = screen.getAllByTestId("icon-eye")[0];
      iconEye.addEventListener("click", () =>
        newBillsInstance.handleClickIconEye(iconEye)
      );

      fireEvent.click(iconEye);
      expect($.fn.modal).toHaveBeenCalled();
    });

    test("Then getBills method should fetch and format bills correctly", async () => {
      const newBillsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      const bills = await newBillsInstance.getBills();
      expect(bills.length).toBeGreaterThan(0);
      expect(bills[0]).toHaveProperty("date");
      expect(bills[0]).toHaveProperty("status");
    });
  });
});