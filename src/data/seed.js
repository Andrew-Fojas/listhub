export const seed = {
    lists: [
      { id: "cooking", name: "Cooking" },
      { id: "school",  name: "School" },
      { id: "household", name: "Household" }
    ],
    tasks: [
      { id: "t1", listId: "cooking", title: "Buy groceries for the week", desc: "Veggies, fruits, pasta, chicken", done: true },
      { id: "t2", listId: "cooking", title: "Try new pasta recipe", desc: "", done: false },
      { id: "t3", listId: "cooking", title: "Meal prep for Monday", desc: "", done: false },
      { id: "t4", listId: "school", title: "Finish math homework", done: false },
      { id: "t5", listId: "household", title: "Do laundry", done: true },
      { id: "t6", listId: "household", title: "Run the dishwasher", done: true }
    ]
  };
/* hard coded tasks for now */  