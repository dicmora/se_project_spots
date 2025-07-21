export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!btn) return;

  const { dataset } = btn;

  if (isLoading) {
    dataset.originalText ??= btn.textContent || defaultText;
    btn.textContent = loadingText;
    btn.disabled = true;
    return;
  }

  btn.textContent = dataset.originalText || defaultText;
  delete dataset.originalText;
  btn.disabled = false;
}

export function handleSubmitWithLoading(
  evt,
  defaultText,
  loadingText,
  asyncFn
) {
  const btn =
    evt.submitter || evt.target.querySelector("button[type='submit']");
  setButtonText(btn, true, defaultText, loadingText);

  return asyncFn().finally(() => {
    setButtonText(btn, false, defaultText, loadingText);
  });
}
