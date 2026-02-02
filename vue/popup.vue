<template>
	<teleport to="body" v-if="isOpen">
		<div
			:class="{
				[$style.overlay]: true,
				[$style.overlayVisible]: isVisible
			}"
			:style="{ 'z-index': zIndexOverlay }"
			@click="close"
		></div>
		<div :class="{
				[$style.popup]: true,
				[$style.popupVisible]: isVisible,
				[$style.popupReduced]: isReduced && isVisible
			}"
			:style="style"
		>
			<div
				v-if="$props.swipe"
				:class="$style.swipe"
				:style="{zIndex: style.zIndex}"
				@touchstart="touchCloseStart"
				@touchend="touchCloseEnd"
			>
			</div>
			<slot/>
			<button :class="$style.close" @click="close">
				<SvgIcon icon="24-kit-cross"/>
			</button>
		</div>
	</teleport>
</template>

<script setup>

import { ref, watch, onMounted, computed, defineProps, defineEmits } from 'vue';
import SvgIcon from '@vue/svg-icon';

const ANIMATION_DURATION = 200;
const TOUCH_DOWN_THRESHOLD = 20;

const props = defineProps([
	'open',
	'isReduced',
	'swipe',
	'style',
]);

const emit = defineEmits([
	'close'
]);

let isOpen = ref(props.open),
	isVisible = ref(false),
	touchStartY = ref(null),
	isReduced = computed(() => props.isReduced),
	style = computed(() => ({
		...props.style,
		zIndex: props.style && props.style.hasOwnProperty('zIndex') ? props.style.zIndex : 5001,
		transform: props.style && props.style.hasOwnProperty('zIndex') && isVisible.value ? props.style.transform : '',
	})),
	zIndexOverlay = style.value.zIndex - 1;

const close = () => {
	isVisible.value = false;
	setTimeout(() => {
		isOpen.value = false;
		emit('close');
	}, ANIMATION_DURATION);
};

const touchCloseStart = (e) => {
	if (props.swipe) {
		touchStartY.value = e.touches[0].clientY;
	}
}

const touchCloseEnd = (e) => {
	if (props.swipe) {
		const deltaY = e.changedTouches[0].clientY - touchStartY.value;
		if (deltaY > TOUCH_DOWN_THRESHOLD) {
			close();
		}
	}
}

onMounted(() => {
	if (!props.open) {
		return;
	}

	setTimeout(() => isVisible.value = true, 0);
});

watch(() => props.open, value => {
	isOpen.value = true;

	if (value) {
		setTimeout(() => isVisible.value = true, 0);
		return;
	}

	setTimeout(() => isVisible.value = false, 0);
	setTimeout(() => isOpen.value = false, ANIMATION_DURATION);
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.overlay {
	position: fixed;
	z-index: 5000;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background: rgb(0, 0, 0);
	opacity: 0;
	transition: 0.3s;
}

.overlayVisible {
	opacity: 0.5;
}

.popup {
	position: fixed;
	z-index: 5001;
	bottom: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	transform: translateY(100%);
	transition: 200ms;
	border-radius: 24px 24px 0 0;
	overflow: hidden;
	background: var(--Bg-default);
	@media (min-width: $media-sm) {
		width: auto;
		transform: translate(-50%, -50%);
		top: 50%;
		bottom: auto;
		left: 50%;
		border-radius: 24px;
		opacity: 0;
	}
}

.popupVisible {
	transform: translateY(0);
	@media (min-width: $media-sm) {
		transform: translate(-50%, -50%);
		opacity: 1;
	}
}

.popupReduced {
	transform: translateY(19vh);
}

.swipe {
	position: absolute;
	width: 40px;
	height: 40px;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	&:before {
		content: '';
		position: absolute;
		width: 38px;
		height: 4px;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 100px;
		background-color: var(--Bg-border);
	}
	@media (min-width: $media-sm) {
		display: none;
	}
}

.close {
	display: none;
	@media (min-width: $media-sm) {
		display: block;
		position: absolute;
		top: 16px;
		box-sizing: border-box;
		padding: 10px;
		border-radius: 8px;

		:global(.is_ltr) & {
			right: 16px;
		}

		:global(.is_rtl) & {
			left: 16px;
		}

		:global(.icon) {
			display: block;
			width: 24px;
			height: 24px;
			fill: var(--Interaction-Secondary-content);
		}

		&:hover {
			:global(.icon) {
				fill: var(--Interaction-Secondary-content_hover);
			}
		}
	}
}

</style>