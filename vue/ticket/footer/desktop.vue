<template>
	<NoMobile>
		<div :class="$style.footer">
			<div :class="[$style.inner, { 'container2': !isSm }, 'padded']">
				<Basket
					:GTM="GTM"
					:itemList="basketItemList"
					@deleteItem="deleteBasketItem"
					@reset="resetBasket"
				/>
				<div :class="$style.timer">
					<template v-if="timeLeft && isShowCheckoutTimer">
						<span>
							<T text="_TIME_REMAINING_" />
						</span>
						<span :class="[$style.time, { [$style.timeAlert]: isTimeAlert }]">
							<Timer :secondsLeft="timeLeft"
										 :alertTime="FIVE_MINUTES"
										 @timeOver="timeOver"
										 @alertTimer="handlerAlertTimer"/>
						</span>
					</template>
				</div>
				<div :class="$style.total">
					<Price :value="totalAmount" /> {{ currency }}
				</div>
				<CheckoutBtn @click="checkout">
					<template v-if="store.checkoutButtonTitle" >
						{{ store.checkoutButtonTitle }}
					</template>
					<template v-else>
						<T text="_CHECKOUT_" />
					</template>

				</CheckoutBtn>
			</div>
		</div>
	</NoMobile>
</template>

<script setup>

import { useWindow } from '@vue/composable/useWindow';
import T from '@vue/t';
import Timer from '@vue/timer';
import Price from '@vue/price';
import NoMobile from '@vue/no-mobile';
import Basket from '@vue/basket/mode-edit/desktop';
import CheckoutBtn from "@vue/ticket-office/casual/components/footer/checkout-btn";
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useCurrency } from '@vue/ticket-office/casual/composable/useCurrency';
import { useBlocked } from '@vue/composable/useBlocked';
import { useStore } from '@vue/ticket-office/casual/store';
import { computed, ref, watch} from 'vue';

const FIVE_MINUTES = 300;

const { isSm } = useWindow();
const { block, unblock } = useBlocked();
const basket = useBasket();
const currency = useCurrency();
const store = useStore();
const GTM = computed(() => store.GTM);
const basketItemList = basket.getBasketItems();
const isShowCheckoutTimer = basket.isShowCheckoutTimer();
const timeLeft = basket.getTimeLeft();

let isTimeAlert = ref(false);
const handlerAlertTimer = () => {
	isTimeAlert.value = true;
};

const totalAmount = basket.getAmount();
const checkout = () => {
	block('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
	basket.checkout().catch(() => unblock('CASUAL_TICKET_OFFICE:SELECTION_BLOCK'));
};
const timeOver = () => window.location.reload();
const deleteBasketItem = idBasketItem => basket.deleteBasketItem(idBasketItem);
const resetBasket = () => basket.resetBasket();

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.footer {
	padding: 20px 0;
	background: var(--Bg-default);
	backdrop-filter: blur(20px);
	position: relative;
	border-top: 1px solid var(--Bg-border);
	background: var(--Bg-default);

	@media (min-width: $media-sm) {
		padding-left: 20px;
		padding-right: 20px;
	}

	@media (min-width: $media-md) {
		padding-left: 0;
		padding-right: 0;
	}
}

.inner {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 24px;
}

.timer {
	position: relative;
	top: 1px;
	display: flex;
	flex-grow: 2;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 5px;
	width: 55px;
	height: 100%;
	padding: 0 8px;
	box-sizing: border-box;
	background: var(--Bg-default);
	text-align: center;
	font-feature-settings: 'clig' off, 'liga' off;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: 22px;
	white-space: nowrap;
}

.time {
	display: inline-block;
	width: 49px;

	:global(.is_ltr) & {
		text-align: left;
	}

	:global(.is_rtl) & {
		text-align: right;
	}
}

.timeAlert {
	color: var(--Accent-alert);
}

.total {
	position: relative;
	top: 2px;
	font-style: normal;
	color: var(--Content-primary);
	white-space: nowrap;
	font-weight: 600;
	font-size: 18px;
	line-height: 140%;
}

</style>