describe("toast", () => {
  it("should render the toast", () => {
    const toast = jest.fn();
    jest.doMock("react-hot-toast", () => ({ toast }));
    const { notify } = require("../toast");

    notify.success("Success");
    notify.error("Error");
    notify.warning("Warning");

    expect(toast).toHaveBeenCalledTimes(3);
    expect(toast).toHaveBeenCalledWith("Success", { icon: "🟢" });
    expect(toast).toHaveBeenCalledWith("Error", { icon: "🔴" });
    expect(toast).toHaveBeenCalledWith("Warning", { icon: "🟡" });
  });
});
