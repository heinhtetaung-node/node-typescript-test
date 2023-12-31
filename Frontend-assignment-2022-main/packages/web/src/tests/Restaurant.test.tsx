import { render, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

import Restaurant from "../Restaurant";

var mockUseParams: jest.Mock;
var mockUseHistory: jest.Mock;
var mockPush: jest.Mock;

jest.mock("react-router", () => {
  mockUseParams = jest.fn();
  return {
    ...(jest.requireActual("react-router") as any),
    useParams: mockUseParams.mockReturnValue({
      id: "123",
    }),
  };
});

jest.mock("react-router-dom", () => {
  mockUseHistory = jest.fn();
  mockPush = jest.fn();
  return {
    ...(jest.requireActual("react-router-dom") as any),
    useHistory: mockUseHistory.mockReturnValue({
      push: mockPush,
    }),
  };
});

window.scrollTo = jest.fn();

const useMockEndpoint = (status: 200 | 404 | 500 = 200) => {
  const mockFetch = (url: string) => {
    switch (status) {
      case 200:
        const urlPaths = url.split("/");
        const endpoint = urlPaths[urlPaths.length - 1];
        console.log("endpoint", endpoint);
        switch (endpoint) {
          case "full":
            return Promise.resolve({
              status,
              ok: true,
              json: () => ({
                name: "โรตี แกงเขียวหวานหมู  ไก่",
                id: "โรตี แกงเขียวหวานหมู  ไก่",
                thumbnailImage:
                  "https://img.wongnai.com/p/100x100/2021/08/14/78da01c38b34401b944aedad1abc94a1.jpg",
                discountedPercent: 0,
                sold: 100,
                fullPrice: 120,
                totalInStock: 200,
                options: [
                  {
                    label: "เนื้อสัตว์ (แกงเขียวหวาน)",
                    choices: [
                      {
                        label: "หมู",
                      },
                      {
                        label: "ไก่",
                      },
                    ],
                  },
                ],
                largeImage:
                  "https://img.wongnai.com/p/1920x0/2021/08/14/78da01c38b34401b944aedad1abc94a1.jpg",
              }),
            });
          case "menus":
            return Promise.resolve({
              status,
              ok: true,
              json: () => ({
                name: "ลืมเคี้ยว",
                id: 567051,
                coverImage:
                  "https://img.wongnai.com/p/1920x0/2021/08/14/f6ae0252eb0d44b79553c0dba6e56cfe.jpg",
                activeTimePeriod: {
                  open: "10:30",
                  close: "20:00",
                },
                menus: [
                  {
                    name: "ข้าวผัดปลาทู",
                    id: "ข้าวผัดปลาทู",
                    thumbnailImage:
                      "https://img.wongnai.com/p/100x100/2021/08/14/95cf2410d1734ca7905672446141a699.jpg",
                    discountedPercent: 15,
                    fullPrice: 80,
                    sold: 100,
                    totalInStock: 200,
                  },
                  {
                    name: "โรตี แกงเขียวหวานหมู  ไก่",
                    id: "โรตี แกงเขียวหวานหมู  ไก่",
                    thumbnailImage:
                      "https://img.wongnai.com/p/100x100/2021/08/14/78da01c38b34401b944aedad1abc94a1.jpg",
                    discountedPercent: 10,
                    fullPrice: 120,
                    sold: 120,
                    totalInStock: 200,
                  },
                  {
                    name: "หมึกผัดพริกเผา",
                    id: "หมึกผัดพริกเผา",
                    thumbnailImage:
                      "https://img.wongnai.com/p/100x100/2021/08/14/8f5b95cc7f614cf0884f8e4bed48fb98.jpg",
                    discountedPercent: 0,
                    fullPrice: 80,
                    sold: 100,
                    totalInStock: 200,
                  },
                  {
                    name: "หมึกผัดพริกเผา",
                    id: "หมึกผัดพริกเผา",
                    thumbnailImage:
                      "https://img.wongnai.com/p/100x100/2021/08/14/8f5b95cc7f614cf0884f8e4bed48fb98.jpg",
                    discountedPercent: 10,
                    fullPrice: 80,
                    sold: 100,
                    totalInStock: 200,
                  },
                  {
                    name: "หมึกผัดพริกเผา",
                    id: "หมึกผัดพริกเผา",
                    thumbnailImage:
                      "https://img.wongnai.com/p/100x100/2021/08/14/8f5b95cc7f614cf0884f8e4bed48fb98.jpg",
                    discountedPercent: 20,
                    fullPrice: 80,
                    sold: 100,
                    totalInStock: 200,
                  },
                ],
              }),
            });
          default:
            return Promise.resolve({ status: 404 });
        }
      case 404:
        return Promise.resolve({ status: 404 });
      default:
        return Promise.reject(new Error("404 not found"));
    }
  };
  return {
    mockFetch,
  };
};

describe("Restaurant", () => {
  it("should show loading at the beginning and show data after fetch api call", async () => {
    const { mockFetch } = useMockEndpoint();
    global.fetch = mockFetch as any;
    const screen = render(<Restaurant />);
    expect(screen.getByTestId("div-loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByTestId("menu-item")[0]).toBeInTheDocument();
    });
  });

  it("should switch Popular / Discount menus", async () => {
    const { mockFetch } = useMockEndpoint();
    global.fetch = mockFetch as any;
    const screen = render(<Restaurant />);
    await waitFor(() => {
      expect(screen.getByTestId("tab-Popular")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("tab-Popular"));
    await waitFor(() => {
      expect(screen.getAllByTestId("menu-item")).toHaveLength(5);
    });
    fireEvent.click(screen.getByTestId("tab-Promotions"));
    await waitFor(() => {
      expect(screen.getAllByTestId("menu-item")).toHaveLength(4);
    });
  });

  it("should open / close menu detail", async () => {
    const { mockFetch } = useMockEndpoint();
    global.fetch = mockFetch as any;
    const screen = render(<Restaurant />);
    await waitFor(() => {
      expect(screen.getAllByTestId("menu-item")[0]).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByTestId("menu-item")[0]);
    await waitFor(() => {
      expect(screen.getByTestId("full-dialog")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close-full-dialog"));
    await waitFor(() => {
      expect(screen.queryByTestId("full-dialog")).not.toBeInTheDocument();
    });
  });

  it("should be redirect to home page if api return 404", async () => {
    const { mockFetch } = useMockEndpoint(404);
    global.fetch = mockFetch as any;
    const screen = render(<Restaurant />);
    expect(screen.getByTestId("div-loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
