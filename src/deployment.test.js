import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

const repoRoot = path.resolve(__dirname, "..");
const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, file), "utf8"));

describe("Vercel configuration", () => {
  const vercel = readJson("vercel.json");

  test("builds the CRA app from source for the site root", () => {
    expect(vercel.framework).toBe("create-react-app");
    expect(vercel.buildCommand).toBe("PUBLIC_URL=/ npm run build");
    expect(vercel.outputDirectory).toBe("build");
  });

  test("falls back to index.html for client routes but not static assets", () => {
    const toIndex = (url) =>
      vercel.rewrites.some(
        ({ source, destination }) =>
          destination === "/index.html" &&
          new RegExp(`^${source}$`).test(url)
      );

    ["/", "/explore", "/author", "/author/123", "/item-details/abc"].forEach(
      (url) => expect(toIndex(url)).toBe(true)
    );
    expect(toIndex("/static/js/main.js")).toBe(false);
    expect(toIndex("/static/css/main.css")).toBe(false);
  });

  test("keeps the GitHub Pages homepage for gh-pages builds", () => {
    expect(readJson("package.json").homepage).toBe(
      "https://dross7278-star.github.io/david-internship"
    );
  });
});

describe("router basename", () => {
  const originalPublicUrl = process.env.PUBLIC_URL;

  beforeEach(() => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    process.env.PUBLIC_URL = originalPublicUrl;
    delete global.fetch;
  });

  test.each([
    ["Vercel (site root)", "", "/explore"],
    ["GitHub Pages", "/david-internship", "/david-internship/explore"],
  ])("renders a deep link on %s", (_, publicUrl, url) => {
    process.env.PUBLIC_URL = publicUrl;
    window.history.pushState({}, "", url);

    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Explore" })
    ).toBeInTheDocument();
  });
});
