<template>
	<button
		:class="$style.datePickerBtn"
		:ref="(el) => setDatePickerBtnRef(el)"
		@click="datePickerClick"
	>
		<SvgIcon icon="24-kit-calendar"/>
	</button>
</template>

<script setup>

import SvgIcon from '@vue/svg-icon';
import { defineEmits } from 'vue';

const emit = defineEmits([
	'datePickerClick',
	'setDatePickerBtnRef',
]);

const datePickerClick = () => emit('datePickerClick');
const setDatePickerBtnRef = (el) => emit('setDatePickerBtnRef', el)

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.datePickerBtn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	padding: 11px;
	border-radius: 12px;
	border: 1px solid var(--Bg-border, rgba(96, 128, 159, 0.14));
	background: var(--Bg-default);
	box-shadow: 0 0 2px 0 rgba(96, 128, 159, 0.08), 0 4px 12px 0 rgba(96, 128, 159, 0.12);
	z-index: 1;

	:global(.icon) {
		fill: var(--Content-secondary);
		width: 24px;
		height: 24px;
	}

	&:hover {
		:global(.icon) {
			fill: var(--Interaction-Secondary-content);
		}
	}

	&:focus-visible {
		box-shadow: none;
		outline: 2px solid var(--Interaction-Focus-keyboard);
	}
}

</style>