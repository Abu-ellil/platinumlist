<template>
	<Mobile>
		<div ref="footerRef" :class="$style.footer">
			<div :class="[$style.inner, 'container2']">
				<Basket
					:bottomGap="bottomGap"
					:isOpen="isOpen"
					:itemList="basketItemList"
					:GTM="GTM"
					@close="closePopup"
					@deleteItem="deleteBasketItem"
					@reset="resetBasket"
				>
					<Details
						:isOpen="isOpen"
						@click="togglePopup"
					/>
				</Basket>
				<CheckoutBtn @click="checkout">
					<span :class="$style.checkout">
						<span :class="$style.checkoutText">
							<template v-if="store.checkoutButtonTitle" >
								{{ store.checkoutButtonTitle }}
							</template>
							<template v-else>
								<T text="_CHECKOUT_" />
							</template>
						</span>
						<span :class="$style.timer">
							<Timer :secondsLeft="timeLeft" @timeOver="timeOver" />
						</span>
					</span>
				</CheckoutBtn>
			</div>
		</div>
	</Mobile>
</template>

<script setup>

import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import T from '@vue/t';
import Timer from '@vue/timer';
import Mobile from '@vue/mobile';
import Basket from '@vue/basket/mode-edit/mobile';
import Details from '@vue/ticket-office/casual/components/footer/mobile/details';
import CheckoutBtn from '@vue/ticket-office/casual/components/footer/checkout-btn';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useBlocked } from '@vue/composable/useBlocked';
import { useStore } from '@vue/ticket-office/casual/store';
import { computed } from 'vue';

const basket = useBasket();
const store = useStore();
const { block, unblock } = useBlocked();
const GTM = computed(() => store.GTM);
const isOpen = ref(false);
const footerRef = ref(null);
const bottomGap = ref(0);
const basketItemList = basket.getBasketItems();
const timeLeft = basket.getTimeLeft();
const timeOver = () => window.location.reload();
const checkout = () => {
	block('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
	basket.checkout().catch(() => unblock('CASUAL_TICKET_OFFICE:SELECTION_BLOCK'));
};
const deleteBasketItem = idBasketItem => basket.deleteBasketItem(idBasketItem);
const resetBasket = () => basket.resetBasket();
const openPopup = () => isOpen.value = true;
const closePopup = () => isOpen.value = false;
const togglePopup = () => isOpen.value ? closePopup() : openPopup();
const syncFooterOffset = () => {
	nextTick(() => {
		if (footerRef.value && !store.exp10333AltVariant) {
			bottomGap.value = footerRef.value.offsetHeight;
		}
	});
};

onMounted(() => {
	syncFooterOffset();
	window.addEventListener('resize', syncFooterOffset);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', syncFooterOffset);
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.footer {
	background: var(--Bg-default);
	backdrop-filter: blur(20px);
	position: relative;
	border-top: 1px solid var(--Bg-border);
	@media (min-width: $media-xxxs) {
		padding: 16px 0;
	}

	:global(.is_ltr) & {
		padding: 12px 12px 12px 20px;
		@media (min-width: $media-sm) {
			padding: 14px 0;
		}
	}

	:global(.is_rtl) & {
		padding: 12px 20px 12px 12px;
		@media (min-width: $media-sm) {
			padding: 14px 0;
		}
	}
}

.inner {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 24px;
}

.checkout {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
}

.checkoutText {
	padding: 0 6px;
	color: var(--Content-pure-inverse);
	font-size: 16px;
	font-style: normal;
	font-weight: 600;
	line-height: 20px;
}

.timer {
	width: 32px;
	padding: 3px 6px;
	border-radius: 2px;
	background: rgba(255, 255, 255, 0.20);
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 14px;
	color: var(--Content-pure-inverse);
}

</style>