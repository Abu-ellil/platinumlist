<template>
	<teleport to="body" v-if="isOpen">
		<template v-if="backgroundUrl">
			<div
				:class="{
					[$style.backgroundImg]: true,
					[$style.backgroundImgVisible]: isBackgroundVisible
				}"
				:style="cssVars"
			>
				<img :src="backgroundUrl" alt="Background" />
			</div>
		</template>
		<div
			:class="{
				[$style.overlay]: true,
				[$style.overlayVisible]: isVisible
			}"
			:style="cssVars"
			@click="overlayClick"
		></div>
		<div
			:class="{
				[$style.popup]: true,
				[$style.popupVisible]: isVisible,
			}"
			:style="cssVars"
		>
			<slot/>
		</div>
	</teleport>
</template>

<script setup>

import { ref, watch, onMounted, onBeforeUnmount, defineProps, defineEmits, computed } from 'vue';
import $ from 'jquery';

const ANIMATION_DURATION = 200;
const POPUP_Z_INDEX = 4003;
const $html = $('html');
const scrollTop = ref(0);

const props = defineProps([
	'open',
	'noBlurDomElementList',
	'backgroundUrl'
]);

const emit = defineEmits([
	'overlayClick',
]);

const isOpen = ref(props.open);
const isVisible = ref(props.open);
const isBackgroundVisible = ref(false);
const cssVars = computed(() => {
	return {
		'--popup-z-index': POPUP_Z_INDEX,
		'--overlay-z-index': POPUP_Z_INDEX-1,
		'--background-z-index': POPUP_Z_INDEX-2,
	}
});

const overlayClick = () => emit('overlayClick');

const downZIndex = () => {
	if (!props['noBlurDomElementList']) {
		return;
	}
	props['noBlurDomElementList'].forEach((el) => {
		$(el).css('z-index', '');

	})
}

const upZIndex = () => {
	if (!props['noBlurDomElementList']) {
		return;
	}
	props['noBlurDomElementList'].forEach((el) => {
		$(el).css('z-index', POPUP_Z_INDEX + 1);
	})
}

watch(() => props['noBlurDomElementList'], (newElementList, oldElementList) => {
	let oldElementsDifference = oldElementList.filter(el => !newElementList.includes(el));
	oldElementsDifference.forEach((el) => $(el).css('z-index', ''))

	let newElementsDifference = newElementList.filter(el => !oldElementList.includes(el));
	newElementsDifference.forEach((el) => $(el).css('z-index', POPUP_Z_INDEX + 1))
});

onMounted(() => {
	if (!props.open) {
		return;
	}

	setTimeout(() => {
		isVisible.value = true;
		isBackgroundVisible.value = true;
	}, 0);
	upZIndex();
});

onBeforeUnmount(() => {
	$html.css({
		'position': '',
		'overflow-y': '',
		'width': '',
		'scroll-behavior': '',
	});
});

watch(() => props.open, value => {
	if (value) {
		isOpen.value = true;
		upZIndex();
		setTimeout(() => {
			isVisible.value = true;
			isBackgroundVisible.value = true;
			$html.css({
				'scroll-behavior': 'smooth',
			})
			scrollTop.value = $html.scrollTop();
			$html.scrollTop(0)
		}, 0);
		setTimeout(() => $html.css({
			'position': 'fixed',
			'overflow-y': $html[0].scrollHeight > $html[0].clientHeight ? 'scroll' : '',
			'width': '100%',
		}), ANIMATION_DURATION);
	} else {
		setTimeout(() => {
			isVisible.value = false;
			isBackgroundVisible.value = false;
			$html.css({
				'position': '',
				'overflow-y': '',
				'width': '',
			});
			$html.scrollTop(scrollTop.value);
		}, 0);
		setTimeout(() => {
			downZIndex();
			isOpen.value = false;
			$html.css({
				'scroll-behavior': '',
			});
		}, ANIMATION_DURATION);
	}
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.backgroundImg {
	position: fixed;
	z-index: var(--background-z-index);
	bottom: 0;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #F1F1F2;
	opacity: 0;
	transition: 0.2s;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.backgroundImgVisible {
	opacity: 1;
}

.overlay {
	position: fixed;
	z-index: var(--overlay-z-index);
	bottom: 0;
	top: 0;
	left: 0;
	width: calc(100vw - (100vw - 100%));
	height: 100vh;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.01);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(10px);
	opacity: 0;
	transition: 0.2s;
	@media (min-width: $media-sm) {
		top: 0;
	}
}

.overlayVisible {
	opacity: 1;
}

.popup {
	position: fixed;
	z-index: var(--popup-z-index);
	bottom: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	transition: 200ms;
	overflow: hidden;
	opacity: 0;
	@media (min-width: $media-sm) {
		padding: 20px;
		width: auto;
		transform: translate(-50%, -50%);
		top: 50%;
		bottom: auto;
		left: 50%;
		border-radius: 12px;
	}
}

.popupVisible {
	opacity: 1;
}

</style>