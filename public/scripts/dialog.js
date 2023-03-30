const newProjectDialog = document.querySelector("#new-project-dialog");
const showDialogButton = document.querySelector("#new-project-button");
const closeDialog = newProjectDialog.querySelector("#close");

showDialogButton.addEventListener("click", () => {
    newProjectDialog.showModal();
});

closeDialog.addEventListener("click", () => {
    newProjectDialog.close();
})