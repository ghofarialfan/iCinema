import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./index";

describe("Pagination component", () => {
  it("renders page numbers for multiple pages", () => {
    render(
      <Pagination
        itemsCount={25}
        pageSize={10}
        currentPage={1}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onPageChange when a page is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        itemsCount={25}
        pageSize={10}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("returns null when only one page exists", () => {
    const { container } = render(
      <Pagination
        itemsCount={5}
        pageSize={10}
        currentPage={1}
        onPageChange={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("highlights the current page", () => {
    render(
      <Pagination
        itemsCount={25}
        pageSize={10}
        currentPage={2}
        onPageChange={jest.fn()}
      />
    );

    const activePage = screen.getByText("2");
    expect(activePage).toHaveClass("page-active");
  });
});
