<script lang="ts">
  let value = "",
    target = "",
    low = -1,
    mid = -1,
    high = -1,
    found = false,
    inProgress = false,
    generatedSize = 10,
    generatedMaxNumber = 100,
    generateRandom = false,
    delayMs = 2500;

  $: numTarget = target.trim() === "" ? NaN : Number(target);
  $: invalidTarget = isNaN(numTarget);
  $: values =
    value.trim() === ""
      ? []
      : value
          .trim()
          .split(/[\s,;.:\t]+/)
          .map(Number)
          .filter(isFinite)
          .sort((a, b) => a - b);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const stop = () => {
    inProgress = false;
    low = high = mid = -1;
    found = false;
  };

  async function startBinarySearch(search: number) {
    inProgress = true;
    low = 0;
    high = values.length - 1;
    while (low <= high && !found) {
      mid = Math.floor((low + high) / 2);
      await delay(delayMs);
      if (!inProgress) return;
      if (values[mid] === search) found = true;
      if (found) break;
      if (values[mid] > search) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    high = low = mid;
    await delay(delayMs);
    high = low = mid = -1;
    target = "";
    found = inProgress = false;
  }
</script>

<main class="min-w-screen min-h-screen flex relative flex-col items-center">
  <input
    bind:value
    disabled={inProgress}
    type="text"
    class="input input-bordered w-[calc(100%-4em)] box-border max-w-2xl mt-10
    transition duration-500 focus:outline-none placeholder-base-content/50 font-sans"
    placeholder="Input an array"
  />
  <div
    class="link flex items-center gap-0.5 duration-500 transition-opacity link-hover text-xs mt-1"
    class:opacity-0={inProgress}
  >
    <button
      on:click={() => {
        let i = 1;
        value = Array.from({ length: generatedSize }, () =>
          generateRandom ? Math.floor(Math.random() * generatedMaxNumber) : i++
        ).join(", ");
      }}
    >
      Generate array
    </button>
    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-circle btn-ghost btn-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-4 h-4 stroke-current"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <div
        tabindex="0"
        class="card compact dropdown-content shadow bg-base-100 rounded-box w-96"
      >
        <div class="card-body">
          <h2 class="card-title">Generated array size: {generatedSize}</h2>
          <input
            type="range"
            min="1"
            max="100"
            bind:value={generatedSize}
            class="range"
          />
          <div
            class="w-full font-mono flex justify-between [&>span]:w-20 text-xs"
          >
            <span class="text-left">1</span>
            <span class="text-center">50</span>
            <span class="text-right">100</span>
          </div>
          <h2 class="card-title">Step delay in ms: {delayMs}</h2>
          <input
            type="range"
            min="500"
            max="4500"
            bind:value={delayMs}
            class="range"
            step="50"
          />
          <div
            class="w-full font-mono flex justify-between [&>span]:w-20 text-xs"
          >
            <span class="text-left">500</span>
            <span class="text-center">2500</span>
            <span class="text-right">4500</span>
          </div>
          <div class="w-full h-1 bg-base-300 rounded my-2" />
          <div class="form-control">
            <label class="label  p-0 cursor-pointer">
              <span class="label-text text-base">Create random values</span>
              <input
                type="checkbox"
                class="toggle"
                bind:checked={generateRandom}
              />
            </label>
          </div>
          <h2 class="card-title" class:opacity-40={!generateRandom}>
            Maximum element value: {generatedMaxNumber}
          </h2>
          <input
            disabled={!generateRandom}
            class:opacity-40={!generateRandom}
            type="range"
            min="1"
            max="1000"
            bind:value={generatedMaxNumber}
            class="range transition"
          />
          <div
            class="w-full font-mono flex justify-between transition [&>span]:w-20 text-xs"
            class:opacity-40={!generateRandom}
          >
            <span class="text-left">1</span>
            <span class="text-center">500</span>
            <span class="text-right">1000</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grow m-4 flex items-center justify-center">
    <div
      class="array z-0 gap-1 rounded-badge flex flex-wrap
      overflow-hidden items-center justify-center"
    >
      {#each values as value, i}
        <div
          class="min-w-[5rem] py-2 text-lg text-base-content
          flex rounded flex-col items-center transition-opacity duration-500 relative
          bg-base-200 -z-10 overflow-hidden"
          class:opacity-20={(i < low || i > high) && inProgress}
        >
          {#each [value == numTarget && i == mid && found, i == mid, i == low, i == high] as condition, j (j)}
            <span
              class:bg-success={j == 0 && condition}
              class:bg-warning={j == 1 && !found && condition}
              class:bg-error={j == 2 && !found && condition}
              class:bg-info={j == 3 && !found && condition}
              class="absolute top-0 bottom-0 left-0 right-0 transition
              duration-500 opacity-50 -z-0"
            />
          {/each}
          <div
            class="px-3 rounded-full self-center mx-2 {value == numTarget &&
              'bg-base-content/10'} {i == mid &&
              value == numTarget &&
              'bg-success/60'} transition duration-500 relative z-99"
          >
            {value}
          </div>
          <div class="text-base-content/40 relative z-99">
            {i}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class:opacity-0={mid < 0} class="transition duration-500">
    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span style="--value:{low};" />
        </span>
        low
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span style="--value:{mid};" />
        </span>
        mid
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span style="--value:{high};" />
        </span>
        high
      </div>
    </div>
  </div>

  <div class="form-control m-4">
    <form
      on:submit|preventDefault={() =>
        invalidTarget || inProgress || startBinarySearch(numTarget)}
      class="input-group"
    >
      <input
        disabled={!values.length || inProgress}
        bind:value={target}
        type="text"
        placeholder="Search for a number"
        class="input input-bordered focus:outline-none placeholder-base-content/60"
      />

      <button
        disabled={invalidTarget || inProgress}
        type="submit"
        class="btn btn-square"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>

    <button
      class:opacity-0={!values.length || inProgress}
      disabled={!values.length || inProgress}
      on:click={() =>
        startBinarySearch(
          Number(
            (target =
              values[Math.floor(Math.random() * values.length)].toString())
          )
        )}
      class="link transition duration-500 link-hover text-xs mt-1"
    >
      Search random
    </button>
  </div>

  <button
    class="btn btn-primary w-12 h-12 p-1 transition duration-500 absolute
    right-8 bottom-8"
    class:opacity-0={!inProgress}
    on:click={stop}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-8 h-8"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    </svg>
  </button>
</main>