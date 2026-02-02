<template>
	<button :class="$style.btn">
		<SvgIcon icon="discount-round"/>
		<span><T text="_CHOOSE_YOUR_DISCOUNTS_"/></span>
	</button>
</template>

<script setup>

import SvgIcon from '@vue/svg-icon';
import T from '@vue/t';

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	border: 1px solid var(--Bg-border);
	background: var(--Bg-default);
	background-image: radial-gradient(circle at 20% -50%, var(--Accent-promo_light), transparent 25%);
	@media (min-width: $media-sm) {
		padding: 28px;
		border-radius: 16px;
		background-image: radial-gradient(ellipse at center -30%, var(--Accent-promo_light), transparent 60%);

		&:hover {
			cursor: pointer;
			border: 1px solid var(--Bg-border);
			box-shadow: 0 4px 12px 0 rgba(96, 128, 159, 0.12);
		}
	}

	:global(.icon) {
		width: 24px;
		height: 24px;
		stroke: var(--Interaction-Secondary-content);
	}

	span {
		color: var(--Interaction-Secondary-content);
		font-size: 16px;
		line-height: 20px;
		@media (min-width: $media-sm) {
			font-size: 20px;
			line-height: 24px;
		}
	}
}

</style>