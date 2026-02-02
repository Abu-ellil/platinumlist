<template>
	<button
		:class="{
			[$style.applyBtn]: true,
			[$style.applyBtnActive]: idEventShow,
			[$style.applyBtnLoading]: isLoading,
		}"
		@click="apply"
	>
		<T text="_APPLY_"/>
	</button>
</template>

<script setup>

import T from '@vue/t';

const emit = defineEmits([
	'apply'
]);

const props = defineProps([
	'idEventShow',
	'isLoading',
]);

const apply = () => emit('apply')

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.applyBtn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px 20px;
	background-color: var(--Interaction-Disable-bg);
	font-size: 18px;
	font-weight: 500;
	line-height: 24px;
	color: var(--Interaction-Disable-content);
	border-radius: 12px;
	margin-top: 24px;
	z-index: 1;

	&:hover {
		cursor: default;
	}
	@media (min-width: $media-sm) {
		width: 200px;
		margin-top: 32px;
	}
}

.applyBtnActive {
	background-color: var(--Interaction-Primary-bg);
	color: var(--Content-pure-inverse);

	&:hover:not(.applyBtnLoading) {
		cursor: pointer;
		background-color: var(--Interaction-Primary-bg_hover);
		color: var(--Interaction-Primary-content_hover);
		transition: all 160ms;
	}
}

.applyBtnLoading {
	opacity: 0.4;
}

</style>