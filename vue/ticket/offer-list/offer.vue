<template>
	<div :class="$style.offer">
		<div :class="$style.info">
			<Mobile>
				<div :class="$style.subInfo">
					<div :class="$style.name">
						<div :class="$style.clampedText">{{ offer['name'] }}</div>
					</div>
					<div v-if="offer['ageLimit']" :class="$style.ages">{{ offer['ageLimit'] }}</div>
				</div>
				<template v-if="isSoldOut">
					<div :class="$style.subInfo">
						<div :class="$style.soldOut">
							<T text="_SOLD_OUT_"/>
						</div>
					</div>
				</template>
				<template v-else>
					<template v-if="hasCrossedPrice || offer['accelerator']">
						<div :class="$style.subInfo">
							<div v-if="offer['accelerator']" :class="$style.accelerator">
								{{ offer['accelerator']['message'] }}
							</div>
						</div>
					</template>
					<div :class="$style.subInfo">
						<div :class="$style.price">
							<template v-if="minPrice === maxPrice">
								<template v-if="discount">
									<div :class="$style.priceBlock">
										<div :class="$style.basePrice">{{ minPrice }} {{ currency }}</div>
										<div :class="$style.crossedPrice">{{ baseOrCrossedPrice }}</div>
									</div>
									<div :class="$style.discount">
										<div :class="$style.discountButton">{{ format(discount) }}</div>
									</div>
									<div :class="$style.promocode">
										<SvgIcon
											v-if="offer['hasAppliedPromoCode'] && !useDiscounts()"
											icon="16-kit-percent-bg"
											:class="[$style.promocodeIcon, 'casual-promocode-icon']"
										/>
									</div>
								</template>
								<template v-else>
									{{ minPrice }} {{ currency }}
								</template>
							</template>
							<template v-else>
								{{ minPrice }}–{{ maxPrice }} {{ currency }}
							</template>
						</div>
					</div>
					<div v-if="$props.offer['isResale']" :class="$style.resalePopover">
						<ResalePopover size="sm" @open="onResalePopoverOpen"/>
					</div>
				</template>
			</Mobile>
			<NoMobile>
				<div :class="$style.subInfo">
					<div :class="$style.name">
						<div :class="$style.clampedText">{{ offer['name'] }}</div>
					</div>
					<div v-if="offer['ageLimit']" :class="$style.ages">{{ offer['ageLimit'] }}</div>
					<div v-if="$props.offer['isResale']" :class="$style.resalePopover">
						<ResalePopover size="md" @open="onResalePopoverOpen" />
					</div>
				</div>
				<div :class="$style.subInfo">
					<template v-if="isSoldOut">
						<div :class="$style.soldOut">
							<T text="_SOLD_OUT_"/>
						</div>
					</template>
					<template v-else>
						<div :class="$style.acceleratorBlock">
							<div :class="$style.price">
								<template v-if="minPrice === maxPrice">
									<template v-if="discount">
										<div :class="$style.priceBlock">
											<div :class="$style.crossedPrice">{{ baseOrCrossedPrice }}</div>
											<div :class="$style.basePrice">{{ minPrice }} {{ currency }}</div>
										</div>
										<div :class="$style.discount">
											<div :class="$style.discountButton">{{ format(discount) }}</div>
										</div>
										<div v-if="offer['hasAppliedPromoCode'] && !useDiscounts()"
											 :class="$style.promocode"
										>
											<SvgIcon
												icon="16-kit-percent-bg"
												:class="[$style.promocodeIcon, 'casual-promocode-icon']"
											/>
										</div>
									</template>
									<template v-else>
										{{ minPrice }} {{ currency }}
									</template>
								</template>
								<template v-else>
									{{ minPrice }}–{{ maxPrice }} {{ currency }}
								</template>
							</div>
							<div v-if="offer['accelerator']" :class="$style.accelerator">
								{{ offer['accelerator']['message'] }}
							</div>
						</div>
					</template>
				</div>
			</NoMobile>
		</div>
		<template v-if="offer['isResale']">
			<button
				:class="{
					[$style.btn]: true,
					[$style.btnDisabled]: isSoldOut,
					[$style.btnBlocked]: isControlBlocked,
					[$style.btnSelected]: selected > 0
				}"
				type="button"
				@click="openResalePopup"
			>
				<template v-if="selected > 0">
					<T :replacements="{ '{{{count}}}': selected }" text="_X_SELECTED_" />
				</template>
				<template v-else>
					{{ buttonText }}
				</template>
			</button>
			<ResalePopup
				:offer="offer"
				:open="isResalePopupOpen"
				@close="closeResalePopup"
			/>
		</template>
		<template v-else-if="isSoldOut">
			<button
				:class="[$style.btn, $style.btnDisabled]"
				type="button"
			>
				<T v-if="offer['hasSeatingMap'] && !offer['hasForceAutoSeating']" text="_CHOOSE_SEATS_"/>
				<T v-else text="_SOLD_OUT_" />
			</button>
		</template>
		<template v-else-if="offer['hasSeatingMap'] && !offer['hasForceAutoSeating'] && !offer['isSeasonPackage']">
			<a
				:class="{
					[$style.btn]: true,
					[$style.btnDisabled]: isSoldOut,
					[$style.btnBlocked]: isControlBlocked,
					[$style.btnSelected]: selected > 0
				}"
				:href="isSoldOut || isControlBlocked ? 'javascript:void(0)' : mapZoneUrl"
			>
				<T
					v-if="selected > 0"
					:replacements="{ '{{{count}}}': selected }"
					text="_X_SELECTED_"
				/>
				<T v-else text="_CHOOSE_SEATS_"/>
			</a>
		</template>
		<template v-else>
			<div :class="$style.counter">
				<p v-if="offer['minPerOrder'] > 1" :class="$style.counterNotice">
					<T :replacements="{ '{{{count}}}': offer['minPerOrder'] }" text="_AT_LEAST_X_TICKETS_" />
				</p>
				<Counter
					:size="counterSize"
					:blocked="isControlBlocked"
					:disabled="isSoldOut"
					:max="offer['maxPerOrder']"
					:min="offer['minPerOrder']"
					:selected="selected"
					@change="change"
				/>
			</div>
		</template>
		<Confirm
			:open="isConfirmOpen"
			btnCancel="_TICKETOFFICE__RESET_SELECTION_POPUP__NO_"
			btnConfirm="_RESET_"
			description="_MIXING_TICKETS_IS_NOT_ALLOWED_"
			title="_PLEASE_SELECT_TICKETS_ONE_CATEGORY_"
			@confirm="confirm"
			@cancel="cancel"
		/>
	</div>
	<div :class="$style.blockLine"></div>
</template>

<script setup>

import App from 'app';
import { ref, computed, defineProps } from 'vue';
import { useOffer } from '@vue/ticket-office/casual/composable/useOffer';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useCurrency } from '@vue/ticket-office/casual/composable/useCurrency';
import { useHallMap } from '@vue/ticket-office/casual/composable/useHallMap';
import { useBlocked } from '@vue/composable/useBlocked';
import { useWindow } from '@vue/composable/useWindow';
import T from '@vue/t';
import Mobile from '@vue/mobile';
import ResalePopover from '@vue/resale/popover';
import NoMobile from '@vue/no-mobile';
import Counter from '@vue/counter';
import Confirm from '@vue/ticket-office/casual/components/common/confirm';
import SvgIcon from '@vue/svg-icon';
import ResalePopup from '@vue/ticket-office/casual/components/offer-list/resale-popup';
import { useGTM } from '@vue/ticket-office/casual/composable/useGTM';
import { useDiscount } from '@vue/ticket-office/casual/composable/useDiscount';

const DEBOUNCE_OFFER_KEY = 'DEBOUNCE:OFFER_CONTROL';
const DEBOUNCE_OFFER_DELAY = 1000;

const props = defineProps(['offer']);

const basket = useBasket();
const currency = useCurrency();
const hallMap = useHallMap();
const { innerWidth } = useWindow();
const { block, unblock, isBlocked } = useBlocked();
const { pushGA4EventsCustomToDataLayer } = useGTM();
const {
	isSoldOut,
	hasCrossedPrice,
	discount,
	getSelectedCount,
	minPrice,
	maxPrice,
	baseOrCrossedPrice,
} = useOffer(
	computed(() => props.offer)
);
const { format, useDiscounts } = useDiscount();


const mapZoneUrl = computed(() => hallMap.getMapZoneUrl(props.offer['svgElementId']));
const isChanging = ref(false);
const isConfirmOpen = ref(false);
const isResalePopupOpen = ref(false);
const selectedCount = ref(getSelectedCount());
const isControlBlocked = computed(() => !isChanging.value && isBlocked('CASUAL_TICKET_OFFICE:SELECTION_BLOCK'));
const selected = computed(() => isChanging.value ? selectedCount.value : getSelectedCount());
const buttonText = computed(() => {
	if (innerWidth.value < 768) {
		return App.ucFirst(App.__('_SELECT_'));
	}

	if (props.offer['type'] === 'package') {
		return App.ucFirst(App.__('_SELECT_PACKAGE_'));
	}

	if (props.offer['type'] === 'voucher') {
		return App.ucFirst(App.__('_SELECT_VOUCHER_'));
	}

	return App.ucFirst(App.__('_SELECT_TICKETS_'));
});
const counterSize = computed(() => {
	if (innerWidth.value >= 768) {
		return 'md';
	}

	if (innerWidth.value >= 390) {
		return 'sm';
	}

	return 'xs';
});

const openResalePopup = () => {
	basket.checkMixingTickets(parseInt(props.offer['idEventMapZone']), props.offer['type'])
		? isConfirmOpen.value = true
		: isResalePopupOpen.value = true;
	pushGA4EventsCustomToDataLayer('clickSelectResaleTicket');
};

const closeResalePopup = () => isResalePopupOpen.value = false;

const cancel = () => {
	isConfirmOpen.value = false;
	isChanging.value = false;
};

let newCount = 0;
const confirm = () => {
	if (props.offer['isResale']) {
		isChanging.value = false;
		isConfirmOpen.value = false;
		basket.removeInvalidBasketItems(props.offer['idEventOffer']).then(() => {
			isResalePopupOpen.value = true;
		});
		return;
	}

	isChanging.value = false;
	selectedCount.value = newCount;
	basket.updateOfferCount(props.offer['idEventOffer'], newCount, basket.isDiscountActive()).finally(() => {
		selectedCount.value = basket.getCountInBasket(props.offer['idEventOffer']);
	});
	isConfirmOpen.value = false;
};

const change = count => {
	if (basket.checkMixingTickets(parseInt(props.offer['idEventMapZone']), props.offer['type'])) {
		newCount = count;
		isConfirmOpen.value = true;
		return;
	}

	isChanging.value = true;
	selectedCount.value = count;
	block('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
	App.debounce(
		() => {
			basket.updateOfferCount(props.offer['idEventOffer'], count, basket.isDiscountActive()).finally(() => {
				selectedCount.value = basket.getCountInBasket(props.offer['idEventOffer']);
				isChanging.value = false;
				unblock('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
			});
		},
		DEBOUNCE_OFFER_KEY,
		DEBOUNCE_OFFER_DELAY
	);
};

const onResalePopoverOpen = () => {
	pushGA4EventsCustomToDataLayer('hintResaleShown');
}

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.offer + .offer {
	padding-top: 12px;
	border-top: 1px solid var(--Bg-default);
	@media (min-width: $media-sm) {
		padding-top: 16px;
	}
}

.offer {
	display: flex;
	flex-direction: row;
	align-items: stretch;
	gap: 12px;
	@media (min-width: $media-sm) {
		gap: 24px;
	}
}

.info {
	display: flex;
	flex-direction: column;
	flex-grow: 2;
	overflow: hidden;
	width: calc(100% - 140px);
	gap: 4px;
	@media (min-width: $media-sm) {
		gap: 8px;
	}
}

.subInfo {
	display: flex;
	flex-direction: row;
	align-items: baseline;
	gap: 8px;
}

.name {
	display: flex;
	align-items: flex-end;
	gap: 8px;
	font-style: normal;
	font-weight: 600;
	font-size: 13px;
	line-height: 16px;
	color: var(--Content-primary);
	@media (min-width: $media-sm) {
		font-size: 16px;
		line-height: 20px;
	}
}

.clampedText {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	white-space: break-spaces;
	text-overflow: ellipsis;
}

.resalePopover {
	width: fit-content;
	margin-top: 4px;
	@media (min-width: $media-sm) {
		margin-top: 0;
	}

	:global(.is_ltr) & {
		@media (min-width: $media-sm) {
			margin-left: 4px;
			padding-left: 8px;
			border-left: 1px solid var(--Bg-border);
		}
	}

	:global(.is_rtl) & {
		@media (min-width: $media-sm) {
			margin-right: 4px;
			padding-right: 8px;
			border-right: 1px solid var(--Bg-border);
		}
	}
}

.soldOut {
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	line-height: normal;
	color: var(--Accent-alert);
	@media (min-width: $media-sm) {
		font-size: 16px;
		line-height: 22px;
	}
}

.price {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	font-weight: 600;
	gap: 4px;
	font-size: 13px;
	color: var(--Content-primary);
	line-height: 16px;
	@media (min-width: $media-sm) {
		gap: 8px;
		font-size: 16px;
		line-height: 20px;
	}
}

.priceBlock {
	display: flex;
	gap: 4px;
	flex-direction: column;
	@media (min-width: $media-sm) {
		flex-direction: row;
	}
}

.basePrice {
	font-weight: 600;
}

.crossedPrice {
	color: var(--Content-secondary);
	font-style: normal;
	font-weight: 400;
	text-decoration: line-through;
}

.ages {
	display: flex;
	white-space: nowrap;
	font-size: 13px;
	line-height: 16px;
	color: var(--Content-secondary);
	@media (min-width: $media-sm) {
		font-size: 14px;
		line-height: 18px;
	}
}

.discount {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.discountButton {
	display: flex;
	direction: ltr;
	color: var(--Interaction-Primary-content);
	background-color: var(--Accent-success);
	border-radius: 4px;
	line-height: 12px;
	padding: 2px 4px;
	font-size: 11px;
	font-style: normal;
	align-items: center;
	@media (min-width: $media-sm) {
		font-size: 12px;
		padding: 3px 6px;
	}
}

.blockLine {
	align-self: stretch;
	border-bottom: 1px solid var(--Bg-border);
	&:last-child {
		display: none;
	}
}

.accelerator {
	display: flex;
	color: var(--Accent-promo);
	font-size: 14px;
	font-weight: 400;
	line-height: 18px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	height: 100%;

	@media (min-width: $media-xxxs) {
		font-size: 12px;
	}

	@media (min-width: $media-sm) {
		font-size: 14px;
	}
}

.btnOuter {
	position: relative;
}

.select {

}

.selectTransparent {
	width: 100%;
	height: 32px;
	position: absolute;
	top: 0;
	left: 0;
	border: 1px solid var(--Accent-alert);
	border-radius: 8px;
	opacity: 0;
}

.promocodeIcon {
	position: relative;
	top: -1px;
	@media(min-width: $media-sm) {
		top: 0;
	}
}

.counter {
	display: flex;
	align-items: center;
	flex-direction: column-reverse;
	gap: 8px;
	@media (min-width: $media-sm) {
		gap: 24px;
	}
}

.counterNotice {
	font-size: 12px;
	font-weight: 400;
	white-space: nowrap;
	color: var(--Content-secondary);
	align-self: center;
	@media (min-width: $media-sm) {
		font-size: 16px;
	}
}

.btn {
	width: 96px;
	height: 32px;
	display: flex;
	box-sizing: border-box;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background: transparent;
	border: 1px solid var(--Interaction-Secondary-border);
	color: var(--Interaction-Secondary-content);
	border-radius: 8px;
	font-size: 14px;
	font-weight: 400;
	flex: 0 0 auto;
	transition: 200ms opacity;
	@media (min-width: $media-xxxs) {
		width: 118px;
		height: 40px;
	}

	@media (min-width: $media-sm) {
		border-radius: 12px;
		width: 142px;
		height: 48px;
		font-size: 16px;
	}

	&:hover {
		border: 1px solid var(--Interaction-Secondary-border_hover);
		color: var(--Interaction-Secondary-content_hover);
	}
}

.btnBlocked {
	opacity: 0.5;
}

.btnDisabled {
	border: 1px solid var(--Interaction-Disable-border);
	color: var(--Interaction-Disable-content);
	cursor: not-allowed;
}

.btnSelected {
	border: 1px solid var(--Accent-success);
	color: var(--Accent-success);

	&:hover {
		border: 1px solid var(--Accent-success-hover);
		color: var(--Accent-success-hover);
	}

	.btnIcon {
		:global(.icon) {
			fill: var(--Accent-success);
			stroke: var(--Accent-success);
		}
	}
}

.btnText {
	flex-grow: 1;
	text-align: center;
	font-size: 14px;
	font-weight: 400;
	@media (min-width: $media-sm) {
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
	}
}

.btnIcon {
	display: none;
	@media (min-width: $media-sm) {
		display: block;
	}

	:global(.icon) {
		width: 10px;
		height: 10px;
		fill: var(--Interaction-Primary-bg);
		stroke: var(--Interaction-Primary-bg);
		transform: rotate(180deg);
	}
}

.promocode {
	display: flex;
	padding: 1px 0;
	flex-direction: column;
	align-items: flex-start;
}

.btnIconActive {
	:global(.icon) {
		transform: rotate(0);
	}
}

.acceleratorBlock {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 4px;
}

</style>