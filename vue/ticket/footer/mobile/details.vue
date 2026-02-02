<template>
	<div :class="$style.details">
		<div :class="$style.firstLine">
			<div :class="$style.ticket">
				<SvgIcon icon="16-kit-ticket" />
			</div>
			<div :class="$style.counter">
				x{{ count }}
			</div>
			<div :class="$style.detailsText">
				<T text="_DETAILS_" />
			</div>
			<div :class="$style.question">
				<SvgIcon v-if="isOpen" icon="16-kit-question-filled" />
				<SvgIcon v-else icon="16-kit-question" />
			</div>
		</div>
		<div :class="$style.secondLine">
			<div :class="$style.totalTitle">
				<T text="_TOTAL_" />:
			</div>
			<div :class="$style.totalPrice">
				<Price :value="totalAmount" /> {{ currency }}
			</div>
		</div>
		<button :class="$style.overlayBtn" @click="click">
			<T text="_DETAILS_" />
		</button>
	</div>
</template>

<script setup>

import { defineProps, defineEmits } from 'vue';
import T from '@vue/t';
import Price from '@vue/price';
import SvgIcon from "@vue/svg-icon";
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useCurrency } from '@vue/ticket-office/casual/composable/useCurrency';

const props = defineProps(['isOpen']);

const emit = defineEmits(['click']);

const basket = useBasket();
const currency = useCurrency();
const count = basket.getBasketItemCount();
const totalAmount = basket.getAmount();
const click = () => emit('click');

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.details {
	display: flex;
	flex-direction: column;
	gap: 4px;
	position: relative;
}

.firstLine {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.ticket {
	width: 16px;
	height: 16px;

	:global(.icon) {
		width: 16px;
		height: 16px;
		fill: var(--Accent-warning)
	}

	:global(.is_ltr) & {
		margin-right: 2px;
	}

	:global(.is_rtl) & {
		margin-left: 2px;
	}
}

.counter {
	color: var(--Accent-warning);
	font-feature-settings: 'clig' off, 'liga' off;
	font-size: 13px;
	font-style: normal;
	font-weight: 400;
	line-height: 18px;
	letter-spacing: 1px;

	:global(.is_ltr) & {
		margin-right: 8px;
	}

	:global(.is_rtl) & {
		margin-left: 8px;
	}
}

.detailsText {
	color: var(--Interaction-Primary-bg);
	text-align: center;
	font-size: 13px;
	font-style: normal;
	font-weight: 400;
	line-height: 18px;

	:global(.is_ltr) & {
		margin-right: 2px;
	}

	:global(.is_rtl) & {
		margin-left: 2px;
	}
}

.question {
	width: 16px;
	height: 16px;

	:global(.icon) {
		width: 16px;
		height: 16px;
		fill: var(--Interaction-Primary-bg);
	}
}

.secondLine {
	display: flex;
	flex-direction: row;
}

.totalTitle {
	color: var(--Content-secondary);
	font-feature-settings: 'clig' off, 'liga' off;
	font-size: 18px;
	font-weight: 400;
	line-height: 22px;

	:global(.is_ltr) & {
		margin-right: 4px;
	}

	:global(.is_rtl) & {
		margin-left: 4px;
	}
}

.totalPrice {
	color: var(--Content-primary);
	font-size: 18px;
	font-style: normal;
	font-weight: 600;
	line-height: 22px;
}

.overlayBtn {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

</style>