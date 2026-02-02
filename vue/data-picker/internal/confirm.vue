<template>
	<template v-if="open">
		<div :class="$style.confirm">
			<div :class="$style.inner">
				<div :class="$style.content">
					<div :class="$style.bell">
						<SvgIcon icon="bell"/>
					</div>
					<div :class="$style.title">
						<T :text="title"/>
					</div>
					<div :class="$style.description">
						<T :text="description"/>
					</div>
				</div>
				<div :class="$style.buttons">
					<button
						:class="[
							$style.btn,
							$style.resetBtn,
							{[$style.loadingBtn]: isLoading},
						]"
						@click="confirm">
						<T :text="btnConfirm"/>
					</button>
					<button
						:class="[
							$style.btn,
							$style.keepSelectionBtn,
							{[$style.loadingBtn]: isLoading},
						]"
						@click="cancel">
						<T :text="btnCancel"/>
					</button>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>

import T from '@vue/t';
import { defineProps, defineEmits } from 'vue';
import SvgIcon from '@vue/svg-icon';

const props = defineProps([
	'open',
	'title',
	'description',
	'btnConfirm',
	'btnCancel',
	'isLoading',
]);

const emit = defineEmits([
	'confirm',
	'cancel',
]);

const confirm = () => emit('confirm');

const cancel = () => emit('cancel');

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.confirm {
	box-sizing: border-box;
	transition: 200ms;
	border-radius: 12px;
	overflow: hidden;
	background: var(--Bg-default);
}

.bell {
	width: 48px;
	height: 48px;
	background-color: var(--Bg-default);
	border-radius: 13px;
	margin-bottom: 8px;

	:global(.icon) {
		width: 48px;
		height: 48px;
		fill: var(--Interaction-Secondary-content);
	}
}

.inner {
	margin: auto;
	@media (min-width: $media-lg) {
		width: 530px;
		height: 320px;
		margin: auto;
	}
}

.content {
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	flex-direction: column;
	margin: auto;
}

.title {
	font-size: 18px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
	margin-bottom: 16px;
}

.description {
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.buttons {
	display: flex;
	justify-content: center;
	flex-direction: column;
	gap: 12px;
	margin: 20px 0 0;
	@media (min-width: $media-sm) {
		flex-direction: row;
		width: auto;
	}
}

.btn {
	display: inline-block;
	vertical-align: middle;
	text-transform: none;
	cursor: pointer;
	box-sizing: border-box;
	border-radius: 12px;
}

.resetBtn {
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 19px;
	padding: 10px 26px;
	border-radius: 12px;
	text-align: center;
	position: relative;
	overflow: hidden;
	border: none;
	transition: 200ms;
	min-height: 48px;
	width: 100%;
	background-color: var(--Interaction-Primary-bg);
	color: var(--Interaction-Primary-content);
	@media (min-width: $media-sm) {
		width: 35%;
	}
}

.loadingBtn {
	opacity: 0.4;
}

.keepSelectionBtn {
	width: 100%;
	min-height: 48px;
	border: 1px solid var(--Interaction-Secondary-border);
	color: var(--Interaction-Secondary-content);
	padding: 8px;
	font-size: 18px;
	font-weight: 400;
	@media (min-width: $media-sm) {
		width: 35%;
	}
}

</style>