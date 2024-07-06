/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    let newBill;

    beforeEach(() => {
      document.body.innerHTML = NewBillUI();
      window.localStorage = localStorageMock;
      window.localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "test@test.com" })
      );
      newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = pathname;
        },
        store: store,
        localStorage: window.localStorage,
      });
    });

    test("Then the page should render correctly", () => {
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });

    describe("When I upload a file", () => {
      test("Then handleChangeFile method should be called", () => {
        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        const fileInput = screen.getByTestId("file");

        fileInput.addEventListener("change", handleChangeFile);

        fireEvent.change(fileInput, {
          target: {
            files: [new File(["sample"], "sample.png", { type: "image/png" })],
          },
        });

        expect(handleChangeFile).toHaveBeenCalled();
      });
    });

    describe("When I submit the form", () => {
      test("Then handleSubmit method should be called and navigate to Bills page", () => {
        const handleSubmit = jest.fn(newBill.handleSubmit);
        newBill.handleSubmit = handleSubmit;
        const form = screen.getByTestId("form-new-bill");

        form.addEventListener("submit", handleSubmit);

        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();
        expect(document.body.innerHTML).toEqual(ROUTES_PATH["Bills"]);
      });
    });
  });
});
