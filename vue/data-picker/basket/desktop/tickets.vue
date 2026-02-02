<template>
	<div v-if="count > 0" :class="[$style.tickets, { [$style.expanded]: $props.expanded}]">
		<div :class="[
			$style.ticket,
			$style.ticketThird,
			{ [$style.ticketHidden]: $props.count < 3 }
		]"><TicketSvg /></div>
		<div :class="[
			$style.ticket,
			$style.ticketSecond,
			{ [$style.ticketHidden]: $props.count < 2 }
		]"><TicketSvg /></div>
		<div :class="[
			$style.ticket,
			$style.ticketFirst,
			{ [$style.ticketHidden]: $props.count < 1 }
		]"><TicketSvg /></div>
		<div :class="[$style.counter, { [$style.currentAnimate]: isCounterChanging }]">
			<template v-if="currentCount > 0">
				<span :class="$style.ticketIcon"><SvgIcon icon="24-kit-ticket" /></span>
				<span :class="$style.counterX" role="presentation">x</span>
				<span :class="$style.counterNumber">{{currentCount}}</span>
			</template>
		</div>
		<div :class="[$style.counter, $style.counterPrev, { [$style.prevAnimate]: isCounterChanging }]">
			<template v-if="prevCount > 0">
				<span :class="$style.ticketIcon"><SvgIcon icon="24-kit-ticket" /></span>
				<span role="presentation">x</span>
				<span :class="$style.counterNumber">{{prevCount}}</span>
			</template>
		</div>
	</div>
</template>

<script setup>

import { ref, computed, watch, defineProps } from 'vue';
import TicketSvg from '@vue/basket/internal/components/desktop/ticket-svg';
import SvgIcon from '@vue/svg-icon';

const props = defineProps([
	'count',
	'expanded'
]);

const isCounterChanging = ref(true);
const prevCount = ref('');
const currentCount = computed(() => props.count);

setTimeout(() => isCounterChanging.value = false, 200);
watch(() => props.count, (_, prevValue) => {
	prevCount.value = prevValue;
	isCounterChanging.value = true;
	setTimeout(() => isCounterChanging.value = false, 200);
});

</script>

<style lang="scss" module>

.tickets {
	position: relative;
}

.counterX {
	font-size: 15px;
}

.counterNumber {
	position: relative;
	top: -1px;
	font-size: 18px;

	:global(.is_ltr) & {
		left: -1px;
	}

	:global(.is_rtl) & {
		right: -1px;
	}
}

.ticketIcon {
	width: 24px;
	height: 24px;
	flex: 0 0 auto;
	display: inline-block;

	:global(.icon) {
		fill: var(--Accent-warning);
		width: 24px;
		height: 24px;
	}
}

.counter {
	width: 80px;
	height: 56px;
	display: flex;
	color: var(--Accent-warning);
	align-items: center;
	justify-content: center;
	position: relative;
	gap: 3px;
	font-feature-settings: 'clig' off, 'liga' off;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	letter-spacing: -1px;
}

.counterPrev {
	opacity: 0;
}

.prevAnimate {
	@keyframes v-basket-counter-prev {
		0% {
			transform: translateY(0);
			opacity: 1;
		}
		100% {
			transform: translateY(8px);
			opacity: 0;
		}
	}

	animation: 200ms ease-out v-basket-counter-prev;
}

.currentAnimate {
	@keyframes v-basket-counter-current {
		0% {
			transform: translateY(-8px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	animation: 200ms ease-out v-basket-counter-current;
}

.ticket {
	position: absolute;
	top: 0;
	width: 80px;
	height: 56px;
	transition: 200ms;
}

.ticketHidden {
	visibility: hidden;
}

:global(.is_ltr) {
	.ticketFirst {
		@keyframes v-basket-ticket-first-ltr {
			0% {
				transform: translateY(10px) rotate(15deg);
				opacity: 0;
			}
			100% {
				transform: translateY(0) rotate(-5deg);
				opacity: 1;
			}
		}

		left: 0;
		transform: rotate(-5deg);
		filter: drop-shadow(-1px 2px 5px rgba(5, 55, 92, 0.16)) drop-shadow(-2px 8px 24px rgba(5, 55, 92, 0.08));
		animation: 200ms ease-out v-basket-ticket-first-ltr;
	}

	.ticketSecond {
		@keyframes v-basket-ticket-second-ltr {
			0% {
				transform: translateY(10px) rotate(15deg);
				opacity: 0;
			}
			40% {
				transform: translateY(0) rotate(-5deg);
				opacity: 1;
			}
			100% {
				transform: rotate(0);
			}
		}

		top: 1px;
		left: 2px;
		transform: rotate(0);
		filter: drop-shadow(-1px 2px 5px rgba(5, 55, 92, 0.16));
		animation: 500ms ease-out v-basket-ticket-second-ltr;
	}

	.ticketThird {
		@keyframes v-basket-ticket-third-ltr {
			0% {
				transform: translateY(10px) rotate(15deg);
				opacity: 0;
			}
			40% {
				transform: translateY(0) rotate(-5deg);
				opacity: 1;
			}
			100% {
				transform: rotate(2deg);
			}
		}

		top: 3px;
		left: 4px;
		transform: rotate(2deg);
		filter: drop-shadow(-1px 2px 5px var(--Bg-border));
		animation: 500ms ease-out v-basket-ticket-third-ltr;
	}
}

:global(.is_rtl) {
	.ticketFirst {
		@keyframes v-basket-ticket-first-rtl {
			0% {
				transform: translateY(10px) rotate(-15deg);
				opacity: 0;
			}
			100% {
				transform: translateY(0) rotate(5deg);
				opacity: 1;
			}
		}

		right: 0;
		transform: rotate(5deg);
		filter: drop-shadow(-1px 2px 5px rgba(5, 55, 92, 0.16)) drop-shadow(-2px 8px 24px rgba(5, 55, 92, 0.08));
		animation: 200ms ease-out v-basket-ticket-first-rtl;
	}

	.ticketSecond {
		@keyframes v-basket-ticket-second-rtl {
			0% {
				transform: translateY(10px) rotate(-15deg);
				opacity: 0;
			}
			40% {
				transform: translateY(0) rotate(5deg);
				opacity: 1;
			}
			100% {
				transform: rotate(0);
			}
		}

		top: 1px;
		right: 2px;
		transform: rotate(0);
		filter: drop-shadow(-1px 2px 5px var(--Bg-border));
		animation: 500ms ease-out v-basket-ticket-second-rtl;
	}

	.ticketThird {
		@keyframes v-basket-ticket-third-rtl {
			0% {
				transform: translateY(10px) rotate(15deg);
				opacity: 0;
			}
			40% {
				transform: translateY(0) rotate(-5deg);
				opacity: 1;
			}
			100% {
				transform: rotate(-2deg);
			}
		}

		top: 3px;
		right: 4px;
		transform: rotate(-2deg);
		filter: drop-shadow(-1px 2px 5px var(--Bg-border));
		animation: 500ms ease-out v-basket-ticket-third-rtl;
	}
}

.expanded {
	:global(.is_ltr) & {
		.ticketFirst {
			top: -2px;
			transform: rotate(-7deg);
		}

		.ticketSecond {
			top: 0;
			transform: rotate(-1deg);
		}

		.ticketThird {
			transform: rotate(5deg);
		}
	}

	:global(.is_rtl) & {
		.ticketFirst {
			top: -2px;
			transform: rotate(7deg);
		}

		.ticketSecond {
			top: 0;
			transform: rotate(1deg);
		}

		.ticketThird {
			transform: rotate(-5deg);
		}
	}
}

</style>