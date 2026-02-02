<template>
	<div :class="{
		[$style.counter]: true,
		[$style.xs]: size === 'xs',
		[$style.sm]: size === 'sm',
		[$style.md]: size === 'md',
		[$style.counterBlocked]: $props.blocked
	}">
		<Dropdown
			:open="isOpen"
			horizontalAlign="end"
			verticalAlign="bottom"
		>
			<template #toggle>
				<div :class="{
					[$style.panel]: true,
					[$style.panelFocus]: isFocused
				}">
					<div :class="$style.panelBorder"></div>
					<div :class="$style.panelContent">
						<button
							:class="{
								[$style.action]: true,
								[$style.decrement]: true,
								[$style.selected]: selected > 0,
								[$style.disabled]: isDecrementDisabled,
							}"
							:disabled="isDecrementDisabled"
							class="casual-offer-control__action casual-offer-control__action--decrement"
							@click="decrement"
						>
							<NoMobile>
								<SvgIcon icon="minus-medium" />
							</NoMobile>
							<Mobile>
								<SvgIcon icon="minus-small" />
							</Mobile>
						</button>
						<div :class="$style.inputWrapper">
							<input
								ref="inputRef"
								:class="$style.input"
								:disabled="$props.blocked"
								:style="inputInline"
								:value="selected"
								type="number"
								@blur="blur"
								@change="change($event.target.value)"
								@focus="focus($event)"
							/>
							<button :class="$style.checkmark" type="button">
								<NoMobile>
									<SvgIcon icon="checkmark-medium" />
								</NoMobile>
								<Mobile>
									<SvgIcon icon="checkmark-small" />
								</Mobile>
							</button>
						</div>
						<button
							:class="{
								[$style.action]: true,
								[$style.increment]: true,
								[$style.selected]: selected > 0,
								[$style.disabled]: isIncrementDisabled,
							}"
							:disabled="isIncrementDisabled"
							class="casual-offer-control__action casual-offer-control__action--increment"
							@click="increment"
						>
							<NoMobile>
								<SvgIcon icon="plus-medium" />
							</NoMobile>
							<Mobile>
								<SvgIcon icon="plus-small" />
							</Mobile>
						</button>
					</div>
				</div>
			</template>
			<template #dropdown>
				<div ref="dropdownRef"
					 :class="{
						[$style.dropdown]: true,
						[$style.dropdownClosing]: isClosing
					}"
				>
					<ul :class="$style.preset">
						<li v-for="count in countList" :key="count">
							<button :class="$style.presetBtn" @click="change(count)">
								{{ count }}
							</button>
						</li>
					</ul>
				</div>
			</template>
		</Dropdown>
	</div>
</template>

<script setup>

/**
 * Available size list: xs, sm, md
 */

import $ from 'jquery';
import { ref, computed, nextTick, defineProps, defineEmits } from 'vue';
import SvgIcon from '@vue/svg-icon';
import Mobile from '@vue/mobile';
import NoMobile from '@vue/no-mobile';
import Dropdown from '@vue/dropdown';

const props = defineProps([
	'size',
	'min',
	'max',
	'blocked',
	'disabled',
	'selected',
]);

const emit = defineEmits([
	'change'
]);

const isOpen = ref(false);
const isFocused = ref(false);
const dropdownRef = ref(null);
const inputRef = ref(null);
const isClosing = computed(() => !isFocused.value && isOpen.value);
const inputInline = ref({});
const size = computed(() => props.size || 'md');
const isIncrementDisabled = computed(() => props.selected >= props.max);
const isDecrementDisabled = computed(() => props.selected === 0 || props.selected < props.min);

const focus = e => {
	if (props.blocked) {
		return;
	}

	isFocused.value = true;

	if (props.max > 2) {
		isOpen.value = true;
	}

	e.target.select();
};

const blur = () => {
	if (props.blocked) {
		return;
	}

	isFocused.value = false;
	nextTick(() => {
		dropdownRef.value && $(dropdownRef.value).one('animationend', () => isOpen.value = false)
	});
};

const change = count => {
	inputRef.value.blur();
	isFocused.value = false;
	if (props.blocked) {
		return;
	}

	if (count < props.min) {
		emit('change', 0);
		return;
	}

	if (count > props.max) {
		emit('change', props.max);
		return;
	}

	emit('change', count);
};

const increment = () => {
	const count = props.selected < props.min
		? props.min
		: props.selected + 1;

	change(count);
};

const decrement = () => {
	const count = props.selected <= props.min
		? 0
		: props.selected - 1;

	change(count);
};

const countList = computed(() => {
	const set = new Set();
	if (props.min > 1) set.add(props.min);
	set.add(Math.floor((props.max + props.min) / 6));
	set.add(Math.floor((props.max + props.min) / 4));
	set.add(Math.floor((props.max + props.min) / 2));
	set.add(props.max);
	return Array.from(set).filter(count => count > 1);
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.counter {
	display: flex;
	align-items: center;
	gap: 12px;
	transition: 200ms opacity;
}

.counterBlocked {
	opacity: 0.5;
}

.panel {
	position: relative;
}

.panelBorder {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: var(--Interaction-Primary-bg);
	border-radius: 8px;
	transition: 200ms;
	transform: scale(0.95);

	.md & {
		border-radius: 12px;
	}
}

.panelContent {
	width: 96px;
	height: 32px;
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	background: var(--Bg-default);
	border-radius: 8px;

	.sm & {
		width: 120px;
		height: 40px;
	}

	.md & {
		border-radius: 12px;
		width: 144px;
		height: 48px;
	}
}

.action {
	width: 32px;
	height: 32px;
	position: absolute;
	top: 0;
	border-radius: 8px;
	border: 1px solid var(--Interaction-Secondary-border);
	color: var(--Interaction-Secondary-content);
	background: var(--Bg-default);
	transition: 200ms;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	touch-action: manipulation;

	.sm & {
		width: 40px;
		height: 40px;
	}

	.md & {
		width: 48px;
		height: 48px;
		border-radius: 12px;

		:global(.icon) {
			width: 16px;
			height: 16px;
		}
	}

	:global(.icon) {
		fill: var(--Interaction-Secondary-content);
		width: 12px;
		height: 12px;
	}

	&:hover {
		border: 1px solid var(--Interaction-Primary-bg_hover);
		color: var(--Interaction-Secondary-content);
	}
}

.decrement {
	:global(.is_ltr) & {
		left: 0;
	}

	:global(.is_rtl) & {
		right: 0;
	}
}

.increment {
	:global(.is_ltr) & {
		right: 0;
	}

	:global(.is_rtl) & {
		left: 0;
	}

	&:hover {
		:global(.icon) {
			fill: var(--Interaction-Secondary-content);
		}
	}
}

.selected {
	border: 1px solid var(--Accent-success);

	&:hover {
		border: 1px solid var(--Accent-success-hover);
		:global(.icon) {
			fill: var(--Accent-success-hover);
		}
	}

	:global(.icon) {
		fill: var(--Accent-success);
	}
}


.disabled {
	border: 1px solid var(--Interaction-Disable-border);
	color: var(--Interaction-Disable-content);

	&:hover {
		cursor: default;
		border: 1px solid var(--Interaction-Disable-border);
		color: var(--Interaction-Disable-content);

		:global(.icon) {
			fill: var(--Interaction-Disable-content);
		}
	}

	:global(.icon) {
		fill: var(--Interaction-Disable-content);
	}
}

.hidden {
	display: none;
}

.inputWrapper {
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid var(--Bg-border);
}

.ghostCounter {
	position: absolute;
	visibility: hidden;
	font-size: 16px;

	.md & {
		font-size: 20px;
	}
}

.input {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 16px;
	text-align: center;
	transition: transform 200ms;
	touch-action: manipulation;
	color: var(--Content-primary);

	.md & {
		font-size: 20px;
	}

	&[type="number"] {
		-moz-appearance: textfield;
	}

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		-moz-appearance: textfield;
		margin: 0;
	}
}

.checkmark {
	height: 32px;
	width: 32px;
	position: absolute;
	display: inline-flex;
	justify-content: center;
	align-items: center;

	.sm & {
		height: 40px;
		width: 40px;
	}

	.md & {
		height: 48px;
		width: 48px;
	}

	:global(.is_ltr) & {
		right: 0;
	}

	:global(.is_rtl) & {
		left: 0;
	}

	:global(.icon) {
		width: 14px;
		height: 14px;
		position: relative;
		fill: var(--Interaction-Secondary-content);

		.md & {
			width: 20px;
			height: 20px;
		}
	}
}

.panelFocus {
	.panelBorder {
		transform: scale(1.03, 1.08);
		border-radius: 9px;

		.md & {
			border-radius: 13px;
		}
	}

	.inputWrapper {
		border-width: 0;
	}

	.input {
		:global(.is_ltr) & {
			text-align: left;
			padding-left: 40px;
			transform: translateX(-32px);

			.sm & {
				padding-left: 56px;
				transform: translateX(-40px);
			}

			.md & {
				padding-left: 64px;
				transform: translateX(-48px);
			}
		}

		:global(.is_rtl) & {
			text-align: right;
			padding-right: 40px;
			transform: translateX(32px);

			.sm & {
				padding-right: 56px;
				transform: translateX(40px);
			}

			.md & {
				padding-right: 64px;
				transform: translateX(48px);
			}
		}
	}

	.checkmark {
		:global(.is_ltr) & {
			@keyframes casual-offer-control-checkmark-ltr {
				0% {
					transform: translateX(110%);
				}
				50% {
					transform: translateX(110%);
				}
				100% {
					transform: translateX(0);
				}
			}
			transform: translateX(0);
			animation: 320ms ease casual-offer-control-checkmark-ltr;
		}

		:global(.is_rtl) & {
			@keyframes casual-offer-control-checkmark-rtl {
				0% {
					transform: translateX(-110%);
				}
				50% {
					transform: translateX(-110%);
				}
				100% {
					transform: translateX(0);
				}
			}
			transform: translateX(0);
			animation: 400ms ease casual-offer-control-checkmark-rtl;
		}
	}

	.decrement {
		:global(.is_ltr) & {
			transform: translateX(-110%);
		}

		:global(.is_rtl) & {
			transform: translateX(110%);
		}
	}

	.increment {
		:global(.is_ltr) & {
			transform: translateX(110%);
		}

		:global(.is_rtl) & {
			transform: translateX(-110%);
		}
	}
}

.dropdown {
	@keyframes casual-offer-control-preset-open {
		0% {
			opacity: 0;
			transform: translateY(15px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	animation: 160ms ease casual-offer-control-preset-open;
}

.dropdownClosing {
	@keyframes casual-offer-control-preset-closing {
		0% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(15px);
		}
	}
	opacity: 0;
	animation: 160ms ease casual-offer-control-preset-closing;
}

.preset {
	display: flex;
	flex-direction: row;
	padding: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.16);
	gap: 8px;
	background: var(--Bg-default);
	border-radius: 8px;

	.md & {
		padding: 12px;
		gap: 12px;
		border-radius: 12px;
	}
}

.presetBtn {
	width: 48px;
	height: 48px;
	padding: 5px 12px;
	border-radius: 12px;
	background: var(--Bg-ghost);
	user-select: none;
	&:hover {
		color: var(--Interaction-Secondary-content_hover);
	}
}

</style>