import StoryModel from "../models/storyModel.js";
import api from "../api/story.js";
import HomePresenter from "../presenters/homePresenter.js"; // tetap eager-load
import NotFoundPresenter from "../presenters/notFoundPresenter.js";

import HomeView from "../views/homeView.js";
import addStoryView from "../views/addStoryView.js";
import authModel from "../models/authModel.js";
import { renderNav } from "../components/navbar.js";

const storyModel = new StoryModel(api);

const routes = {
  "": (app) => HomePresenter(app, storyModel, HomeView),
  "#/": (app) => HomePresenter(app, storyModel, HomeView),
  "#/add": async () => {
    const { default: AddStoryPresenter } = await import(
      "../presenters/addStoryPresenter.js"
    );
    return AddStoryPresenter(addStoryView, storyModel);
  },
  "#/login": async (app) => {
    const { default: LoginPresenter } = await import(
      "../presenters/loginPresenter.js"
    );
    const { default: LoginView } = await import("../views/loginView.js");
    return LoginPresenter(app, authModel, LoginView, () => {
      renderNav();
      window.location.hash = "#/";
    });
  },
  "#/register": async (app) => {
    const { default: RegisterPresenter } = await import(
      "../presenters/registerPresenter.js"
    );
    const { default: RegisterView } = await import("../views/registerView.js");
    return RegisterPresenter(app, authModel, RegisterView, () => {
      window.location.hash = "#/login";
    });
  },
};

export default async function router() {
  const app = document.querySelector("#app");
  const hash = window.location.hash || "#/";
  const page = routes[hash] || NotFoundPresenter;

  if (document.startViewTransition) {
    document.startViewTransition(() => page(app));
  } else {
    await page(app);
  }
}
