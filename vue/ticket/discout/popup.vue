<template>
	<div
		v-if="hasDiscountsBtn"
		:class="$style.discountBlock"
	>
		<DiscountBtn @click="toggle"/>
		<DiscountPopup
			:discountList="discountList"
			:idEventDiscountActive="idEventDiscountActive"
			:appliedPromocode="appliedPromocode"
			:isVisible="isVisible"
			:isOpen="isOpen"
			@toggle="toggle"
			@apply="apply"
			@reset="resetPromocode"
		/>
	</div>
</template>

<script setup>

import App from 'app';
import Messenger from 'messenger';
import { computed, ref } from 'vue';
import { useDiscount } from '@vue/ticket-office/casual/composable/useDiscount';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { usePromocode } from '@vue/ticket-office/casual/composable/usePromocode';
import DiscountBtn from '@vue/ticket-office/casual/components/discount/btn';
import DiscountPopup from '@vue/discount/popup';

const ANIMATION_DURATION = 200;

const { discountList, hasDiscountsBtn } = useDiscount();
const { getIdEventDiscountActive } = useBasket();
const { applyPromocode, appliedPromocode, resetPromocode } = usePromocode();
const idEventDiscountActive = computed(() => getIdEventDiscountActive());
const header = document.querySelector("[data-header]");
const isVisible = ref(false);
const isOpen = ref(false);

const apply = (promocode) => {
	applyPromocode(promocode, 0).then(({promoCodeResult, redirectUrl}) => {
		if (promoCodeResult === 'applied') {
			if (redirectUrl) {
				window.location.href = redirectUrl;
			} else {
				window.location.reload();
			}
			return;
		}

		if (promoCodeResult === 'valid') {
			Messenger.error(App.__('_POPUP_PROMO_CODE_VALID_'), 3000);
			return;
		}

		Messenger.error(App.__('_PROMOCODE_INVALID_'), 3000);
	});
};

const toggle = () => {
	if (isOpen.value) {
		isVisible.value = false;
		setTimeout(() => {
			isOpen.value = false;
		}, ANIMATION_DURATION)
	} else {
		isOpen.value = true;
		setTimeout(() => {
			isVisible.value = true;
		}, ANIMATION_DURATION)
	}
};

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.discountBlock {
	width: 100%;
	@media (min-width: $media-sm) {
		flex: 1 1 auto;
		min-width: 300px;
		width: auto;
	}
}

</style>