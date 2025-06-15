
export default function NotFoundPresenter(view) {
  return function render(app) {
    app.innerHTML = view();
  };
}
