(function () {
  let listTask = [];
  let listName = '';


  //создаём и возвращаем зоголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введитье название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    //определяет состояние кнопки "Добавить дело" активное/неактивное
    input.addEventListener('input', function () {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    })

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  //создаем и возвращаем элемент списка
  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done == true) {
      item.classList.add('list-group-item-success');
    }

    //добавляем обработчик на кнопки
    doneButton.addEventListener('click', function () {

      item.classList.toggle('list-group-item-success');
      for (let item of listTask) {
        if (item.id == obj.id) item.done = !item.done;
      }
      saveList(listTask, listName)
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        for (let i = 0; i < listTask.length; i++) {
          if (listTask[i].id == obj.id) {
            listTask.splice(i, 1);
          }
        }
        saveList(listTask, listName)
      }
    });

    //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопокам,чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    }

  }
  //создаем максимальный id для нового объекта
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr))
  };

  function createTodoApp(container, title, keyName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName)
    if (localData !== null && localData !== '') listTask = JSON.parse(localData)

    for (const itemList of listTask) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    //браузер создает событие submit на форму при нажатии энтер или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      //эта строчка необходима, чтобы предотвратить стандартное действие браузера
      //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }

      //объект "Дело"
      let newTask = {
        id: getNewID(listTask),
        name: todoItemForm.input.value,
        done: false,
      }

      let todoItem = createTodoItem(newTask);

      listTask.push(newTask);

      saveList(listTask, listName)


      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      //обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    });


  }



  window.createTodoApp = createTodoApp;

})();
