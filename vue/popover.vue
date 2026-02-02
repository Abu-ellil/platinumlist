<template>
	<NoMobile>
		<Outside :tag="$props.outerTag" @click="close">
			<Component
				:is="$props.tag ?? 'div'"
				ref="toggleRef"
				:class="$props.toggleClass || $style.toggle"
				:style="{ cursor: 'pointer', ...($props.toggleStyle || {}) }"
				role="button"
				tabindex="0"
				@click="toggleClick"
				@keydown="toggleKeydown"
			>
				<slot name="toggle"></slot>
			</Component>
		</Outside>
		<PopoverTooltip :anchorRef="anchorRef" :open="isOpen">
			<slot name="content"></slot>
		</PopoverTooltip>
	</NoMobile>
	<Mobile>
		<Component
			:is="$props.tag ?? 'div'"
			:class="$props.toggleClass || $style.toggle"
			:style="{ cursor: 'pointer', ...($props.toggleStyle || {}) }"
			role="button"
			tabindex="0"
			@click="toggleClick"
			@keydown="toggleKeydown"
		>
			<slot name="toggle"></slot>
		</Component>
		<PopoverPopup
			:btnText="$props.popupBtnText"
			:headerText="$props.popupHeaderText"
			:open="isOpen"
			@close="close"
		>
			<slot name="content"></slot>
		</PopoverPopup>
	</Mobile>
</template>

<script setup>

/**
 * Usage example
 *
 * 1. Without anchor
 * <Popover>
 *     <template #toggle>toggle</template>
 *     <template #content>content</template>
 * </Popover>
 *
 * 2. With anchor
 * <Popover>
 *     <template #toggle>toggle <PopoverAnchor>zone for corner catching</PopoverAnchor></template>
 *     <template #content>content</template>
 * </Popover>
 */

import { ref, watch, computed, defineProps, defineEmits } from 'vue';
import Outside from '@vue/outside';
import NoMobile from '@vue/no-mobile';
import Mobile from '@vue/mobile';
import { useWindow } from '@vue/composable/useWindow';
import PopoverTooltip from '@vue/popover/tooltip';
import PopoverPopup from '@vue/popover/popup';

const props = defineProps([
	'tag',
	'outerTag',
	'popupHeaderText',
	'toggleClass',
	'toggleStyle',
	'popupBtnText'
]);

const emit = defineEmits([
	'open',
	'close',
]);

const isOpen = ref(false);
const toggleRef = ref(null);
const { innerWidth } = useWindow();

const anchorRef = computed(() => {
	if (!toggleRef.value) {
		return undefined;
	}

	const anchorRef = toggleRef.value.querySelector('[data-vue-popover-anchor]');
	if (anchorRef) {
		return anchorRef;
	}

	return toggleRef.value;
});

const close = () => isOpen.value = false;

const toggleClick = () => isOpen.value = !isOpen.value;

const toggleKeydown = (e) => {
	if (e.code === 'Space') {
		isOpen.value = !isOpen.value;
	}
}

watch(innerWidth, close);

</script>

<style lang="scss" module>

.toggle {
	display: inline-block;
}

</style>