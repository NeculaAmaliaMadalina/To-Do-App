export const validateTask = (task) => {
  let isValid = true;
  let errors = {};

  if (!task.title || task.title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
    isValid = false;
  }

  if (!task.description || task.description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
    isValid = false;
  }

  const today = new Date().toISOString().split("T")[0];
  if (!task.deadline || task.deadline < today) {
    errors.deadline = "Deadline must be today or later.";
    isValid = false;
  }

  return { isValid, errors };
};
