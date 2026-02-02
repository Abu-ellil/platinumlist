<template>
	<div :class="$style.control">
		<button
			:class="$style.button"
			@click.stop="open"
		>
			<slot></slot>
		</button>
	</div>
	<MoreInfoPopup
		:name="name"
		:description="description"
		:galleryImageList="galleryImageList"
		:open="isOpen"
		@close="close"
	/>
</template>

<script setup>

import { ref, defineProps } from 'vue';
import MoreInfoPopup from '@vue/ticket-office/casual/components/more-info/popup';

const props = defineProps([
	'name',
	'description',
	'galleryImageList',
]);

const isOpen = ref(false);

const open = () => {
	isOpen.value = true;
};

const close = () => {
	isOpen.value = false;
};

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.control {
	display: flex;
	flex: 0 0 auto;
	flex-direction: column-reverse;
	align-items: center;
	gap: 12px;
	transition: 200ms opacity;
	@media (min-width: $media-sm) {
		flex-direction: row;
	}
}

.button {
	color: var(--Interaction-Secondary-content);
	cursor: pointer;
	display: flex;
	gap: 4px;
	align-items: center;
	flex-wrap: nowrap;
	flex: 0 0 auto;
	font-size: 12px;
	border: none;
	padding: 0;
	font-weight: normal;
	@media (min-width: $media-xxxs) {
		font-size: 14px;
	}

	@media (min-width: $media-sm) {
		gap: 8px;
		font-size: 16px;
	}

	:global(.icon) {
		width: 12px;
		height: 12px;
		fill: var(--Interaction-Secondary-content);
		@media(min-width: $media-sm) {
			width: 14px;
			height: 14px;
		}
	}

	&:hover {
		color: var(--Interaction-Secondary-content_hover);
		:global(.icon) {
			fill: var(--Interaction-Secondary-content_hover);
		}
	}
}

</style>