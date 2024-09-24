<script>
  import "./app.css";
  import profile from "./assets/idiot-2.jpg";
  import { taskData } from "./lib/stores.js";
  import { afterUpdate, onMount } from "svelte";
  import {
    Button,
    Modal,
    Label,
    Input,
    Range,
    Select,
    Dropdown,
    DropdownItem,
    Avatar
  } from "flowbite-svelte";
  import { Progressbar } from "flowbite-svelte";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from "flowbite-svelte";
  import {
    EditOutline,
    ArrowLeftOutline,
    PlusOutline,
    TrashBinOutline,
    ExclamationCircleOutline,
  } from "flowbite-svelte-icons";

  const defaultTask = {
    id: "0",
    parentId: "-1",
    name: "",
    dueDate: null,
    progress: 0,
    difficulty: 0,
    ordering: 0,
  };

  let rawData = [];
  let filteredData = [];
  let selectedTask = { ...defaultTask };
  let canComplete = testComplete();

  let sortBy = "ordering";
  let showDue = false;

  let modalOpen = false;
  let deleteModalOpen = false;
  let modalType = "";

  let newTask = { ...defaultTask };

  onMount(() => {
    taskData.subscribe((value) => {
      rawData = value;
    });

    filteredData = rawData.filter((x) => x.parentId == "-1");
    selectedTask = filteredData[0];
  });

  afterUpdate(() => {
    canComplete = testComplete();
  });

  function sortTable() {
    switch (sortBy) {
      case "ordering":
        filteredData = filteredData.sort((a, b) => {
          return a.ordering - b.ordering;
        });
        break;
      case "dueDate":
        filteredData = filteredData.sort((a, b) => {
          return b.dueDate - a.dueDate;
        });
        break;
      case "difficulty":
        filteredData = filteredData.sort((a, b) => {
          return a.difficulty - b.difficulty;
        });
        break;
      case "progress":
        filteredData = filteredData.sort((a, b) => {
          return b.progress - a.progress;
        });
        break;
      default:
        break;
    }
  }

  function changeMode() {
    if (showDue) {
      let date = new Date();
      date.setDate(date.getDate() + 7);
      filteredData = rawData
        .filter((x) => new Date(x.dueDate) < date && new Date(x.dueDate) > new Date() && x.dueDate != null)
        ?.sort((a, b) => {
          return b.dueDate - a.dueDate;
        });
    } else {
      filteredData = rawData.filter((x) => x.parentId == "-1");
    }
    selectedTask = filteredData[0] ?? {};
  }

  function stepIntoTask() {
    if (rawData.filter((x) => x.parentId == selectedTask.id).length > 0) {
      filteredData = rawData.filter((x) => x.parentId == selectedTask.id);
      selectedTask = filteredData[0];
    } else {
      filteredData = rawData.filter((x) => x.parentId == selectedTask.id);
      let parentId = selectedTask.id;
      selectedTask = { ...defaultTask };
      selectedTask.parentId = parentId;
      //alert("The selected task has no subtasks.");
    }
  }

  function stepOutOfTask() {
    filteredData = rawData.filter(
      (x) =>
        x.parentId ==
        rawData.find((y) => y.id == selectedTask.parentId).parentId,
    );
    selectedTask = filteredData[0];
  }

  function openModal(modalOpenType) {
    modalType = modalOpenType;
    if (modalType == "Delete") {
      deleteModalOpen = true;
    } else {
      modalOpen = true;
    }
  }

  function submitTask() {
    let newData = [...rawData];
    if (modalType == "Add") {
      newTask.id = generateUUID();
      newTask.parentId = selectedTask.parentId;
      newData.push(newTask);
    } else if (modalType == "Edit") {
      newData[newData.findIndex((x) => x.id == newTask.id)] = newTask;
    } else {
      newData.splice(
        newData.findIndex((x) => x.id == selectedTask.id),
        1,
      );
    }
    taskData.update(() => newData);
    taskData.subscribe((value) => {
      rawData = value;
    });
    filteredData = rawData.filter((x) => x.parentId == selectedTask.parentId);
    selectedTask =
      filteredData.find((x) => x.id == selectedTask.id) ?? filteredData[0];
  }

  function testComplete() {
    let children = rawData.filter((x) => x.parentId == selectedTask.id);
    if (selectedTask.progress == 100) {
      return false;
    } else if (children.length == 0) {
      return true;
    } else {
      for (let i = 0; i < children.length; i++) {
        if (children[i].progress != 100) {
          return false;
        }
      }
    }
    return true;
  }

  function generateUUID() {
    let n = Date.now();
    return (++n).toString(36);
  }
</script>

<main>
  <div class="body">
    <h1>Task Master</h1>
    <Avatar
      class="acs top-2 right-2"
      style={"position:fixed"}
      src={profile}
      dot={{ color: "green" }}
    />
    <Dropdown triggeredBy=".acs">
      <div slot="header" class="px-4 py-2">
        <span class="block text-sm text-gray-900 dark:text-white"
          >Casey Jackson</span
        >
        <span class="block truncate text-sm font-medium">name@flowbite.com</span
        >
      </div>
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem slot="footer">Sign out</DropdownItem>
    </Dropdown>
    <div class="tasks">
      <div class="leftScreen">
        <h2>List of Tasks</h2>
        <h2>
          {rawData.find((x) => x.id == selectedTask.parentId)?.name ?? ""}
        </h2>
        <div class="inline">
          <Label class="inline">
            Show:
            <Select
              class="inline w-1/4 ml-2 bg-blue-200"
              bind:value={showDue}
              on:change={changeMode}
              items={[
                { value: false, name: "All Tasks" },
                { value: true, name: "Due Soon" },
              ]}
            />
          </Label>
        </div>
        <div class="inline ml-2">
          <Label class="inline">
            Order By:
            <Select
              class="inline w-1/4 ml-2 bg-blue-200"
              bind:value={sortBy}
              on:change={sortTable}
              items={[
                { value: "ordering", name: "Default" },
                { value: "dueDate", name: "Due Date" },
                { value: "difficulty", name: "Difficulty" },
                { value: "progress", name: "Progress" },
              ]}
            />
          </Label>
        </div>
        <Button
          class="float-right"
          color="green"
          on:click={() => {
            newTask = { ...defaultTask };
            openModal("Add");
          }}><PlusOutline />&nbsp;Add New Task</Button
        >
        <Table class="mt-4" color="blue" hoverable={true}>
          <TableHead>
            <TableHeadCell>Task</TableHeadCell>
            <TableHeadCell>Due Date</TableHeadCell>
            <TableHeadCell>Difficulty</TableHeadCell>
            <TableHeadCell>Progress</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            {#each filteredData as dataPoint (dataPoint.id)}
              <TableBodyRow
                class="cursor-pointer"
                on:click={() => {
                  selectedTask = dataPoint;
                }}
                on:dblclick={() => {
                  stepIntoTask();
                }}
              >
                <TableBodyCell
                  >{dataPoint.name}
                  {#if dataPoint.progress == 100}
                    <div class="inline">-</div>
                    <div class="inline text-green-600 font-bold">Complete!</div>
                  {/if}
                </TableBodyCell>
                <TableBodyCell
                  >{dataPoint.dueDate == null
                    ? ""
                    : dataPoint.dueDate.toLocaleString()}</TableBodyCell
                >
                <TableBodyCell>
                  {#if dataPoint.difficulty < 5}
                    <Progressbar
                      animate
                      tweenDuration={1000}
                      color="green"
                      progress={dataPoint.difficulty * 10}
                    />
                  {:else if dataPoint.difficulty < 8}
                    <Progressbar
                      animate
                      tweenDuration={1000}
                      color="yellow"
                      progress={dataPoint.difficulty * 10}
                    />
                  {:else}
                    <Progressbar
                      animate
                      tweenDuration={1000}
                      color="red"
                      progress={dataPoint.difficulty * 10}
                    />
                  {/if}
                </TableBodyCell>
                <TableBodyCell
                  ><Progressbar
                    animate
                    tweenDuration={1000}
                    color="green"
                    progress={dataPoint.progress}
                  /></TableBodyCell
                >
              </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
      </div>
      <div class="rightScreen">
        {#if selectedTask.parentId != "-1"}
          <ArrowLeftOutline
            withEvents
            class="w-12 h-12 cursor-pointer absolute top-5 left-5"
            on:click={stepOutOfTask}
          />
        {/if}
        {#if filteredData.length > 0}
          <div class="selectedTaskContainer">
            <h2 class="inline">{selectedTask.name}</h2>
            {#if selectedTask.progress == 100}
              <h2 class="inline">-</h2>
              <h2 class="inline text-green-500">Complete!</h2>
            {:else}
              <EditOutline
                withEvents
                class="w-12 h-12 cursor-pointer absolute top-5 right-20"
                on:click={() => {
                  newTask = { ...selectedTask };
                  openModal("Edit");
                }}
              />
              <TrashBinOutline
                withEvents
                class="w-12 h-12 cursor-pointer absolute top-5 right-5"
                color="red"
                on:click={() => {
                  openModal("Delete");
                }}
              />
            {/if}
            <div class="taskInfo">
              <div class="info">
                <p class="progressBarText">Completion</p>
                <Progressbar
                  animate
                  tweenDuration={1000}
                  color="green"
                  labelInside
                  size="h-4"
                  progress={selectedTask.progress}
                  class="mb-7"
                />
                <p class="progressBarText">Difficulty</p>
                {#if selectedTask.difficulty < 5}
                  <Progressbar
                    animate
                    tweenDuration={1000}
                    color="green"
                    labelInside
                    size="h-4"
                    progress={selectedTask.difficulty * 10}
                    class="mb-7"
                  />
                {:else if selectedTask.difficulty < 8}
                  <Progressbar
                    animate
                    tweenDuration={1000}
                    color="yellow"
                    labelInside
                    size="h-4"
                    progress={selectedTask.difficulty * 10}
                    class="mb-7"
                  />
                {:else}
                  <Progressbar
                    animate
                    tweenDuration={1000}
                    color="red"
                    labelInside
                    size="h-4"
                    progress={selectedTask.difficulty * 10}
                    class="mb-7 text-black"
                  />
                {/if}
                <Button
                  color="dark"
                  class="w-1/2 h-24 text-2xl"
                  on:click={stepIntoTask}>More Detail</Button
                >
              </div>
              <div class="info">
                <p>Due Date: {selectedTask.dueDate ?? "No Due Date"}</p>
                <p>Ordering: {selectedTask.ordering ?? 0}</p>
                <Button
                  color="green"
                  class="w-1/2 h-24 text-2xl"
                  disabled={!canComplete}
                  on:click={() => {
                    newTask = { ...selectedTask };
                    modalType = "Edit";
                    newTask.progress = 100;
                    submitTask();
                  }}>Mark Complete</Button
                >
              </div>
            </div>
          </div>
          <div class="subtaskContainer">
            <h2>Subtasks</h2>
            <div class="subtable">
              <Table color="blue" hoverable={true}>
                <TableHead>
                  <TableHeadCell>Task</TableHeadCell>
                  <TableHeadCell>Due Date</TableHeadCell>
                  <TableHeadCell>Difficulty</TableHeadCell>
                  <TableHeadCell>Progress</TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                  {#each rawData.filter((x) => x.parentId == selectedTask.id) as dataPoint (dataPoint.id)}
                    <TableBodyRow>
                      <TableBodyCell
                        >{dataPoint.name}
                        {#if dataPoint.progress == 100}
                          <div class="inline">-</div>
                          <div class="inline text-green-600 font-bold">
                            Complete!
                          </div>
                        {/if}
                      </TableBodyCell>
                      <TableBodyCell
                        >{dataPoint.dueDate == null
                          ? ""
                          : dataPoint.dueDate.toLocaleString()}</TableBodyCell
                      >
                      <TableBodyCell
                        >{#if dataPoint.difficulty < 5}
                          <Progressbar
                            animate
                            tweenDuration={1000}
                            color="green"
                            progress={dataPoint.difficulty * 10}
                          />
                        {:else if dataPoint.difficulty < 8}
                          <Progressbar
                            animate
                            tweenDuration={1000}
                            color="yellow"
                            progress={dataPoint.difficulty * 10}
                          />
                        {:else}
                          <Progressbar
                            animate
                            tweenDuration={1000}
                            color="red"
                            progress={dataPoint.difficulty * 10}
                          />
                        {/if}</TableBodyCell
                      >
                      <TableBodyCell
                        ><Progressbar
                          animate
                          tweenDuration={1000}
                          color="green"
                          progress={dataPoint.progress}
                        /></TableBodyCell
                      >
                    </TableBodyRow>
                  {/each}
                </TableBody>
              </Table>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <Modal bind:open={modalOpen} size="lg" autoclose outsideclose class="w-full">
    <form>
      <h2>{modalType} Task</h2>
      <div class="flex">
        <Label class="w-1/2 m-4">
          <span>Task Name</span>
          <Input
            type="text"
            name="name"
            placeholder="Task Name"
            bind:value={newTask.name}
            required
          />
        </Label>
        <Label class="w-1/2 m-4">
          <span>Due Date</span>
          <Input
            type="datetime-local"
            name="dueDate"
            placeholder="Due Date"
            bind:value={newTask.dueDate}
            required
          />
        </Label>
      </div>
      <div class="flex">
        <Label class="w-1/2 m-4">
          <span>Progress: {newTask.progress}%</span>
          <Range
            min="0"
            max="100"
            bind:value={newTask.progress}
            required
          />
        </Label>
        <Label class="w-1/2 m-4">
          <span>Difficulty: {newTask.difficulty}</span>
          <Range
            min="0"
            max="10"
            bind:value={newTask.difficulty}
            step=1
            required
          />
        </Label>
        <Label class="w-1/2 m-4">
          <span>Ordering</span>
          <Input
            type="number"
            name="ordering"
            placeholder="Ordering"
            min="0"
            bind:value={newTask.ordering}
            required
          />
        </Label>
      </div>
      <div class="flex justify-center">
        <Button class="m-2" color="green" on:click={submitTask}>Submit</Button>
        <Button class="m-2" color="red">Cancel</Button>
      </div>
    </form>
  </Modal>
  <Modal bind:open={deleteModalOpen} size="xs" autoclose outsideclose>
    <div class="text-center">
      <ExclamationCircleOutline
        class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
      />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        Are you sure you want to delete this task?
      </h3>
      <Button color="red" class="me-2" on:click={submitTask}
        >Yes, I'm sure</Button
      >
      <Button color="alternative">No, cancel</Button>
    </div>
  </Modal>
</main>

<style>
  h1 {
    font-size: 3rem;
    font-weight: bold;
  }

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .body {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #bfdbfe;
  }

  .tasks {
    display: flex;
    height: 100%;
  }

  .leftScreen,
  .rightScreen {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .leftScreen,
  .selectedTaskContainer,
  .subtaskContainer {
    border: 1px solid black;
    border-radius: 20px;
    margin: 10px;
    padding: 10px;
    background-color: #60a5fa;
  }

  .leftScreen {
    height: 91%;
  }

  .subtaskContainer {
    height: 37%;
  }

  .taskInfo {
    display: flex;
    padding: 10px;
    padding-top: 40px;
  }

  .info {
    width: 50%;
  }

  p {
    font-size: 1.4rem;
    margin-bottom: 40px;
  }

  .progressBarText {
    font-size: 20px;
    margin: 0;
    text-align: left;
  }

  .subtable {
    overflow-y: auto;
    height: 74%;
  }
</style>
