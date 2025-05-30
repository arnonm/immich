<script lang="ts">
  import Icon from '$lib/components/elements/icon.svelte';
  import FullScreenModal from '$lib/components/shared-components/full-screen-modal.svelte';
  import { getPeopleThumbnailUrl } from '$lib/utils';
  import { type PersonResponseDto } from '@immich/sdk';
  import { Button } from '@immich/ui';
  import { mdiArrowLeft, mdiMerge } from '@mdi/js';
  import { onMount, tick } from 'svelte';
  import { t } from 'svelte-i18n';
  import ImageThumbnail from '../assets/thumbnail/image-thumbnail.svelte';
  import CircleIconButton from '../elements/buttons/circle-icon-button.svelte';

  interface Props {
    personMerge1: PersonResponseDto;
    personMerge2: PersonResponseDto;
    potentialMergePeople: PersonResponseDto[];
    onReject: () => void;
    onConfirm: ([personMerge1, personMerge2]: [PersonResponseDto, PersonResponseDto]) => void;
    onClose: () => void;
  }

  let {
    personMerge1 = $bindable(),
    personMerge2 = $bindable(),
    potentialMergePeople = $bindable(),
    onReject,
    onConfirm,
    onClose,
  }: Props = $props();

  let choosePersonToMerge = $state(false);

  const title = personMerge2.name;

  const changePersonToMerge = (newPerson: PersonResponseDto) => {
    const index = potentialMergePeople.indexOf(newPerson);
    [potentialMergePeople[index], personMerge2] = [personMerge2, potentialMergePeople[index]];
    choosePersonToMerge = false;
  };

  onMount(async () => {
    await tick();
    document.querySelector<HTMLElement>('#merge-confirm-button')?.focus();
  });
</script>

<FullScreenModal title="{$t('merge_people')} - {title}" {onClose}>
  <div class="flex items-center justify-center py-4 md:h-36 md:py-4">
    {#if !choosePersonToMerge}
      <div class="flex h-20 w-20 items-center px-1 md:h-24 md:w-24 md:px-2">
        <ImageThumbnail
          circle
          shadow
          url={getPeopleThumbnailUrl(personMerge1)}
          altText={personMerge1.name}
          widthStyle="100%"
        />
      </div>
      <div class="mx-0.5 flex md:mx-2">
        <CircleIconButton
          title={$t('swap_merge_direction')}
          icon={mdiMerge}
          onclick={() => ([personMerge1, personMerge2] = [personMerge2, personMerge1])}
        />
      </div>

      <button
        type="button"
        disabled={potentialMergePeople.length === 0}
        class="flex h-28 w-28 items-center rounded-full border-2 border-immich-primary px-1 dark:border-immich-dark-primary md:h-32 md:w-32 md:px-2"
        onclick={() => {
          if (potentialMergePeople.length > 0) {
            choosePersonToMerge = !choosePersonToMerge;
          }
        }}
      >
        <ImageThumbnail
          border={potentialMergePeople.length > 0}
          circle
          shadow
          url={getPeopleThumbnailUrl(personMerge2)}
          altText={personMerge2.name}
          widthStyle="100%"
        />
      </button>
    {:else}
      <div class="grid w-full grid-cols-1 gap-2">
        <div class="px-2">
          <button type="button" onclick={() => (choosePersonToMerge = false)}> <Icon path={mdiArrowLeft} /></button>
        </div>
        <div class="flex items-center justify-center">
          <div class="flex flex-wrap justify-center md:grid md:grid-cols-{potentialMergePeople.length}">
            {#each potentialMergePeople as person (person.id)}
              <div class="h-24 w-24 md:h-28 md:w-28">
                <button type="button" class="p-2 w-full" onclick={() => changePersonToMerge(person)}>
                  <ImageThumbnail
                    border={true}
                    circle
                    shadow
                    url={getPeopleThumbnailUrl(person)}
                    altText={person.name}
                    widthStyle="100%"
                  />
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="flex px-4 md:pt-4">
    <h1 class="text-xl text-gray-500 dark:text-gray-300">{$t('are_these_the_same_person')}</h1>
  </div>
  <div class="flex px-4 pt-2">
    <p class="text-sm text-gray-500 dark:text-gray-300">{$t('they_will_be_merged_together')}</p>
  </div>

  {#snippet stickyBottom()}
    <Button fullWidth shape="round" color="secondary" onclick={onReject}>{$t('no')}</Button>
    <Button id="merge-confirm-button" fullWidth shape="round" onclick={() => onConfirm([personMerge1, personMerge2])}>
      {$t('yes')}
    </Button>
  {/snippet}
</FullScreenModal>
