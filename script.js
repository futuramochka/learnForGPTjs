const blockAddTask = document.querySelector('.add-task');
const blockQueryTask = document.querySelector('.query');
blockAddTask.classList.add('block-task');
const inputAddTask = document.createElement('input');
inputAddTask.id = 'input-add-task';
inputAddTask.placeholder = 'Добавить текст задачи';
inputAddTask.type = 'text';

const btnAddTask = document.createElement('button');
btnAddTask.textContent = "Добавить задачу";
btnAddTask.classList.add('button-add-task');

blockAddTask.append(inputAddTask,btnAddTask);

const listTasks = document.createElement('ul');
listTasks.classList.add('list-tasks');
blockAddTask.appendChild(listTasks);

const queryTask = document.createElement('input');
queryTask.id = 'query-task';
queryTask.placeholder = 'Ищем задачу';

const btnQueryTask = document.createElement('button');
btnQueryTask.textContent = 'Go';
btnQueryTask.classList.add('btn-query')

blockQueryTask.append(queryTask, btnQueryTask);

function createTaskManager(){
  let tasks = [];
  let nextId = 1;

  const tasksSaved = localStorage.getItem('tasks');
  if(tasksSaved){
    tasks = JSON.parse(tasksSaved);
    nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id))+1: 1;
  }

  return{
    save(){
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    add(text){
      tasks.push({id: nextId++, text, completed: false, visual: true});
      manager.save();
    },
    remove(id){
      const idTask = tasks.findIndex(task => task.id === id);
      if(idTask !== -1){
        tasks.splice(idTask, 1)
        manager.save();
      }
    },
    toggle(id){
      const task = tasks.find(task => task.id === id);
      task.completed = !task.completed;
      manager.save();
    },
    render(){
      listTasks.innerHTML = '';
      let indexCheckbox = 1;
      tasks.forEach(task => {
        if(task.visual === true){
          const itemList = document.createElement('li');
          const span = document.createElement('span');
          
          span.textContent = task.text;
          itemList.classList.add('item-list');
    
          const btnDeleteTask = document.createElement('button');
          btnDeleteTask.textContent = "Удалить задачу";
          btnDeleteTask.classList.add('btn-delete-task');

          btnDeleteTask.addEventListener('click', function(){
            manager.remove(task.id);
            manager.render();
          })
    
          const checkBox = document.createElement('input');
          checkBox.type = 'checkbox';
          checkBox.id =  `input-checkbox-completed-${indexCheckbox++}`;
          checkBox.checked = task.completed;
          
          checkBox.addEventListener('change', function(){
            manager.toggle(task.id);
            manager.render();
          })
    
          itemList.append(span, btnDeleteTask, checkBox)
          listTasks.append(itemList);
        }
      })
      return listTasks;
    },
    filter(query){
      tasks.forEach(task => {
        const getQery = task.text.toLowerCase().includes(query.toLowerCase());
        !getQery ? task.visual = false: task.visual = true;
      })
      manager.save();
    }
  }
}

const manager = createTaskManager();

btnAddTask.addEventListener('click', function(){
  const textTask = inputAddTask.value.trim();
  if(textTask !== ''){
    manager.add(textTask);
    manager.render();
  }
  inputAddTask.value = '';
})

btnQueryTask.addEventListener('click', function(){
  let query = queryTask.value.trim();
  console.log(query)
  manager.filter(query);
  manager.render()
})
