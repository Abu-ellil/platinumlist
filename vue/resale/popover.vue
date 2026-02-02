<template>
	<NoMobile>
		<Popover @close="close" @open="open">
			<template #toggle>
				<div :class="$style.toggle">
					<span :class="{
						[$style.text]: true,
						[$style.textSm]: size === 'sm',
						[$style.textMd]: size === 'md',
					}">
						<T text="_TICKETS_FROM_FANS_" />
					</span>
					<PopoverAnchor :class="{
						[$style.anchor]: true,
						[$style.anchorSm]: $props.size === 'sm',
					}">
						<SvgIcon :class="$style.icon" icon="question-mark-circled-2" />
					</PopoverAnchor>
				</div>
			</template>
			<template #content>
				<T text="_TICKETS_FROM_FANS_DESCRIPTION_" />
			</template>
		</Popover>
	</NoMobile>
	<Mobile>
		<button :class="$style.toggle" @click="open">
				<span :class="{
					[$style.text]: true,
					[$style.textSm]: $props.size === 'sm',
				}">
				<T text="_TICKETS_FROM_FANS_" />
			</span>
			<span :class="{
				[$style.anchor]: true,
				[$style.anchorSm]: $props.size === 'sm',
			}">
				<SvgIcon :class="$style.icon" icon="question-mark-circled-2" />
			</span>
		</button>
		<Popup :open="isOpen" :swipe="true" :zIndex="6000" @close="close">
			<div :class="$style.popupHead">
				<p :class="$style.popupTitle">
					<T text="_TICKETS_FROM_FANS_" />
				</p>
				<button :class="$style.popupClose" @click="close">
					<T text="_CLOSE_" />
				</button>
			</div>
			<p :class="$style.popupContent">
				<T text="_TICKETS_FROM_FANS_DESCRIPTION_" />
			</p>
		</Popup>
	</Mobile>
</template>

<script setup>

/**
 * Available sizes: sm, md
 */

import { ref, defineProps, computed, defineEmits } from 'vue';
import T from '@vue/t';
import Popover from '@vue/popover';
import PopoverAnchor from '@vue/popover-anchor';
import SvgIcon from '@vue/svg-icon';
import Mobile from '@vue/mobile';
import NoMobile from '@vue/no-mobile';
import Popup from '@vue/popup';

const props = defineProps([
	'size',
]);

const emit = defineEmits([
	'open',
	'close'
]);

const size = computed(() => {
	return props.size || 'sm';
});

const isOpen = ref(false);

const open = () => {
	isOpen.value = true;
	emit('open');
};

const close = () => {
	isOpen.value = false;
	emit('close');
};

</script>

<style lang="scss" module>

.text {
	flex: 0 0 auto;
	color: var(--Accent-warning);
	font-size: 14px;
	font-weight: 400;
	line-height: 18px;
	white-space: nowrap;
}

.textSm {
	font-size: 14px;
}

.textMd {
	font-size: 16px;
}

.anchor {
	width: 16px;
	height: 16px;
	flex: 0 0 auto;
	display: inline-flex;
}

.anchorSm {
	width: 14px;
	height: 14px;
}

.icon {
	width: 100%;
	height: 100%;
	fill: var(--Accent-warning);
}

.toggle {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
}

.popupHead {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
	background: var(--Bg-ghost);
}

.popupTitle {
	flex: 0 0 auto;
	font-size: 16px;
	font-weight: 600;
}

.popupClose {
	flex: 0 0 auto;
	color: var(--PL---Main-blue, #37A7F8);
	font-size: 16px;
	font-weight: 400;
}

.popupContent {
	padding: 20px;
	font-size: 14px;
	font-weight: 400;
	line-height: 18px;
}

</style>