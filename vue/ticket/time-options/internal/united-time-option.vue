<template>
	<button
		:class="$style.unitedOptionItemBtn"
		@click="datePickerClick"
	>
		<span :class="$style.unitedOptionItemBtnCalendar">
			<SvgIcon icon="24-kit-calendar"/>
		</span>
		<span :class="$style.unitedOptionItemBtnText">
			{{ selectedOptionDateTime }}
		</span>
		<SvgIcon
			v-if="promoCode"
			icon="16-kit-percent-bg"
			:class="$style.unitedOptionItemBtnPromoCode"
		/>
		<span :class="$style.unitedOptionItemBtnArrow">
			<SvgIcon icon="16-kit-arrowhead-down"/>
		</span>
	</button>
</template>

<script setup>

import SvgIcon from '@vue/svg-icon';
import { defineEmits, defineProps, computed } from 'vue';
import { useStore } from '@vue/ticket-office/casual/store';

const emit = defineEmits([
	'datePickerClick',
]);
const props = defineProps([
	'selectedOptionDateTime',
]);

const store = useStore();
const promoCode = computed(() => store.promocode);

const datePickerClick = () => emit('datePickerClick');

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.unitedOptionItemBtn {
	display: flex;
	gap: 12px;
	align-items: center;
	width: 100%;
	padding: 11px 16px;
	border-radius: 12px;
	border: 1px solid var(--Bg-border);
	background: var(--Bg-default);
	box-shadow: 0 0 2px 0 rgba(96, 128, 159, 0.08), 0 4px 12px 0 rgba(96, 128, 159, 0.12);

	@media (min-width: $media-sm) {
		width: 300px;
	}
}

.unitedOptionItemBtnCalendar {
	display: flex;
	align-items: center;
	flex: 0 0 auto;

	:global(.icon) {
		fill: var(--Content-secondary);
		width: 24px;
		height: 24px;
	}
}

.unitedOptionItemBtnText {
	display: flex;
	color: var(--Interaction-Secondary-content);
	font-size: 16px;
	line-height: 20px;
}

.unitedOptionItemBtnPromoCode {
	width: 16px;
	height: 16px;
	fill: var(--Accent-promo);
	background-color: var(--Bg-default);
	border-radius: 3px;
}

.unitedOptionItemBtnArrow {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex: 1 1 auto;

	:global(.icon) {
		width: 16px;
		height: 16px;
		fill: var(--Interaction-Secondary-content);
	}
}

</style>