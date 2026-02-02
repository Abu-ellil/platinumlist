<template>
	<button
		:class="[
			$style.btn,
			'btn',
			'btn--blue',
			{
				'btn--disabled': isDisabled,
				[$style.btnLoading]: isLoading
			}
		]"
		:disabled="isDisabled || isLoading"
		@click="click"
	>
		<span :class="$style.content">
			<slot></slot>
		</span>
		<span v-if="isLoading" :class="$style.loader">
			<span :class="[$style.point, $style.pointFirst]"></span>
			<span :class="[$style.point, $style.pointSecond]"></span>
			<span :class="[$style.point, $style.pointThird]"></span>
		</span>
	</button>
</template>

<script setup>

import { computed, defineEmits } from 'vue';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useLoader } from '@vue/ticket-office/casual/composable/useLoader';
import { useBlocked } from '@vue/composable/useBlocked';
import { useStore } from '@vue/ticket-office/casual/store';
import { useGTM } from '@vue/ticket-office/casual/composable/useGTM';

const emit = defineEmits(['click']);

const basket = useBasket();
const loader = useLoader();
const { isBlocked } = useBlocked();
const store = useStore();
const isDisabled = computed(() => {
	if (basket.isEmpty().value) {
		return true;
	}

	return isBlocked('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
});

const isLoading = computed(() => loader.loading);
const { pushGA4EventsCustomToDataLayer } = useGTM();
const click = () => {
	emit('click');
	pushGA4EventsCustomToDataLayer('toCheckoutClick', null, { 'basket_additional_steps': store.basketConfig.basketAdditionalSteps });
};

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.btn {
	min-width: 130px;
	min-height: 40px;
	padding: 10px 12px;
	border-radius: 8px;
	text-align: center;
	position: relative;
	overflow: hidden;
	border: none;
	transition: 200ms;
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 16px;

	@media (min-width: $media-xxs) {
		min-height: 44px;
	}

	@media (min-width: $media-sm) {
		min-width: unset;
		font-size: 18px;
		font-weight: 600;
		line-height: 24px;
		padding: 16px 32px;
	}
}

.btnLoading {
	background: var(--Bg-default);
	border-color: var(--Bg-border);
	&:hover {
		color: var(--Interaction-Primary-content);
		background: var(--Bg-default);
		border-color: var(--Bg-border);
	}

	.content {
		transition: none;
		opacity: 0;
	}
}

.textTransparent {
	opacity: 0;
}

.loader {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5px;
}

.point {
	width: 5px;
	height: 5px;
	background: var(--Bg-secondary);
	border-radius: 50%;
	transition: 200ms;
}

.pointFirst {
	@keyframes casual-footer-checkout-btn-loader-first {
		0% {
			opacity: 1;
		}
		25% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		75% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
	animation: 800ms linear 0s infinite casual-footer-checkout-btn-loader-first;
}

.pointSecond {
	@keyframes casual-footer-checkout-btn-loader-second {
		0% {
			opacity: 1;
		}
		25% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		75% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
	animation: 800ms linear 0s infinite casual-footer-checkout-btn-loader-second;
}

.pointThird {
	@keyframes casual-footer-checkout-btn-loader-third {
		0% {
			opacity: 1;
		}
		25% {
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		75% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	animation: 800ms linear 0s infinite casual-footer-checkout-btn-loader-third;
}

</style>