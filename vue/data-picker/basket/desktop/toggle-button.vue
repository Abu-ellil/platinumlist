<template>
	<button
		v-if="$props.count > 0"
		:class="[$style.button, { [$style.open]: $props.open }]"
		type="button"
		@click="click"
		@mouseout="mouseOut"
		@mouseover="mouseOver"
	>
		<div :class="$style.tickets">
			<Tickets :count="$props.count" :expanded="isHover || $props.open" />
		</div>
		<div :class="$style.content">
			<div :class="$style.inner">
				<span :class="$style.text"><slot></slot></span>
			</div>
		</div>
	</button>
</template>

<script setup>

import { defineProps, defineEmits, ref } from 'vue';
import Tickets from '@vue/basket/internal/components/desktop/tickets';

const props = defineProps([
	'open',
	'count',
]);

const emit = defineEmits([
	'click'
]);

const isHover = ref(false);

const mouseOver = () => isHover.value = true;

const mouseOut = () => isHover.value = false;

const click = () => emit('click');

</script>

<style lang="scss" module>

.button {
	display: inline-flex;
	justify-content: space-between;
	column-gap: 8px;
	position: relative;

	:global(.is_ltr) & {
		padding-left: 16px;
	}

	:global(.is_rtl) & {
		padding-right: 16px;
	}
}

.tickets {
	display: flex;
	align-items: center;
	position: absolute;
	top: 2px;

	:global(.is_ltr) & {
		left: 0;
	}

	:global(.is_rtl) & {
		right: 0;
	}
}

.content {
	@keyframes v-basket-toggle {
		0% {
			background: var(--Bg-ghost);
		}
		40% {
			background: var(--Bg-ghost);
		}
		100% {
			background: var(--Bg-default);
		}
	}

	padding: 16px 24px;
	background: var(--Bg-default);
	border-radius: 12px;
	animation: 500ms cubic-bezier(0.4, 0, 0.25, 1) v-basket-toggle;
	transition: background 200ms;

	.open & {
		background: rgba(55, 167, 248, 0.12);
	}
}

.inner {
	:global(.is_ltr) & {
		@keyframes v-basket-toggle-inner-ltr {
			0% {
				opacity: 0;
				transform: translateX(-16px);
			}
			40% {
				opacity: 0;
				transform: translateX(-16px);
			}
			100% {
				opacity: 1;
				transform: translateX(0);
			}
		}

		margin-left: 55px;
		animation: 500ms cubic-bezier(0.4, 0, 0.25, 1) v-basket-toggle-inner-ltr;
	}

	:global(.is_rtl) & {
		@keyframes v-basket-toggle-inner-rtl {
			0% {
				opacity: 0;
				transform: translateX(16px);
			}
			40% {
				opacity: 0;
				transform: translateX(16px);
			}
			100% {
				opacity: 1;
				transform: translateX(0);
			}
		}

		margin-right: 55px;
		animation: 500ms cubic-bezier(0.4, 0, 0.25, 1) v-basket-toggle-inner-rtl;
	}
}

.text {
	color: var(--Interaction-Secondary-content);
	font-feature-settings: 'clig' off, 'liga' off;
	font-size: 18px;
	font-style: normal;
	font-weight: 600;
	line-height: normal;
	transition: 200ms;
}

.content:hover .text {
	color: var(--Interaction-Secondary-content_hover);
}

</style>