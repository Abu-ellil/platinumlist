<template>
	<Mobile>
		<div :class="$style.promoCodeBtnWrapper">
			<PromoCodeBtn
				:appliedPromocode="appliedPromocode"
				:isOpen="isPromoCodeOpen"
				:style="{borderRadius: '10px'}"
				@click="togglePromoCode"
			/>
			<PopupBlurOverlay
				v-if="hasValidPromoCode"
				:open="isPromoCodeOpen"
				:noBlurDomElementList="[header]"
				@overlayClick="togglePromoCode"
			>
				<div :class="$style.blurredPopupContent">
					<div
						:class="{
							[$style.blurredPopupPromoCodeWrapper]: true,
							[$style.blurredPopupPromoCodeWrapperVisible]: isPromoCodeVisible
						}"
					>
						<PromoCodeContent
							@close="togglePromoCode"
						/>
					</div>
				</div>
			</PopupBlurOverlay>
		</div>
	</Mobile>
</template>

<script setup>

import { usePromocode } from '@vue/ticket-office/casual/composable/usePromocode';
import Mobile from '@vue/mobile';
import PromoCodeBtn from '@vue/promocode/v2/btn';
import PromoCodeContent from '@vue/ticket-office/casual/components/promocode/content';
import PopupBlurOverlay from '@vue/popup-blur-overlay';

const {
	appliedPromocode,
	hasValidPromoCode,
	isPromoCodeOpen,
	isPromoCodeVisible,
} = usePromocode();

const header = document.querySelector("[data-header]");

const togglePromoCode = () => {
	if (isPromoCodeOpen.value) {
		isPromoCodeVisible.value = false;
		setTimeout(() => {
			isPromoCodeOpen.value = false;
		}, 200);
	} else {
		isPromoCodeOpen.value = true;
		setTimeout(() => {
			isPromoCodeVisible.value = true;
		}, 200);
	}
}

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.promoCodeBtnWrapper {
	position: relative;
	display: flex;
	flex: 0 0 auto;
}

.blurredPopupContent {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	height: 100%;
	padding-top: 8px;
}

.blurredPopupPromoCodeWrapper {
	background-color: var(--Bg-default);
	padding: 24px 20px 16px;
	border-radius: 24px 24px 0 0;
	box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.06), 0px -1px 8px 0px rgba(0, 0, 0, 0.06);
	box-sizing: border-box;
	width: 100%;
	transform: translateY(100%);
	transition: 200ms;
}

.blurredPopupPromoCodeWrapperVisible {
	transform: translateY(0);
}

</style>