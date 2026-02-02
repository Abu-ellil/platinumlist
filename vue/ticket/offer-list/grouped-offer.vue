<template>
	<div :class="$style.groupedOffer">
		<div :class="$style.info">
			<NoMobile>
				<template v-if="isSoldOut">
					<div :class="$style.subInfo">
						<div :class="$style.soldOut">
							<T text="_SOLD_OUT_"/>
						</div>
					</div>
					<div :class="$style.subInfo">
						<div v-if="ageLimit" :class="$style.ages">
							{{ ageLimit }}
						</div>
					</div>
				</template>
				<template v-else>
					<div :class="$style.subInfo">
						<div v-if="crossedPrice" :class="$style.crossedPrice">
							{{ crossedPrice }} {{ currency }}
						</div>
						<div v-if="!hiddenPriceMode" :class="$style.price">
							<template v-if="price['min'] !== price['max']">
								<T text="_FROM_"/>
								{{ price['min'] }} {{ currency }}
							</template>
							<template v-else>
								{{ price['min'] }} {{ currency }}
							</template>
						</div>
						<div v-if="discountAccelerateName" :class="$style.discount">{{ discountAccelerateName }}</div>
						<div v-else-if="discount" :class="$style.discount">-{{ discount }}%</div>
						<SvgIcon
							v-if="hasAppliedPromoCode"
							icon="16-kit-percent-bg"
							:class="$style.promocodeIcon"
						/>
						<div v-if="customAccelerateText" :class="$style.accelerator">
							{{ customAccelerateText }}
						</div>
					</div>
					<div v-if="ageLimit" :class="$style.subInfo">
						<div :class="$style.ages">
							{{ ageLimit }}
						</div>
					</div>
				</template>
			</NoMobile>
			<Mobile>
				<template v-if="isSoldOut">
					<div :class="$style.subInfo">
						<div :class="$style.soldOut">
							<T text="_SOLD_OUT_"/>
						</div>
					</div>
					<div :class="$style.subInfo">
						<div v-if="ageLimit" :class="$style.ages">
							{{ ageLimit }}
						</div>
					</div>
				</template>
				<template v-else>
					<div v-if="crossedPrice" :class="$style.subInfo">
						<div v-if="crossedPrice" :class="$style.crossedPrice">
							{{ crossedPrice }} {{ currency }}
						</div>
					</div>
					<div :class="[$style.subInfo, $style.subInfoWrap]">
						<div v-if="!hiddenPriceMode" :class="$style.price">
							<template v-if="price['min'] !== price['max']">
								<T text="_FROM_"/>
								{{ price['min'] }} {{ currency }}
							</template>
							<template v-else>
								{{ price['min'] }} {{ currency }}
							</template>
						</div>
						<template v-if="discountAccelerateName">
							<div :class="$style.discount">{{ discountAccelerateName }}</div>
						</template>
						<template v-else-if="discount">
							<div :class="$style.discount">-{{ discount }}%</div>
						</template>
						<SvgIcon
							v-if="hasAppliedPromoCode"
							icon="16-kit-percent-bg"
							:class="$style.promocodeIcon"
						/>
						<div v-if="customAccelerateText" :class="$style.accelerator">
							{{ customAccelerateText }}
						</div>
					</div>
					<div v-if="ageLimit" :class="$style.subInfo">
						<div :class="$style.ages">
							{{ ageLimit }}
						</div>
					</div>
				</template>
			</Mobile>
		</div>
		<template v-if="isSoldOut">
			<button
				:class="[$style.btn, $style.btnDisabled]"
				type="button"
			>
				<T text="_SOLD_OUT_"/>
			</button>
		</template>
		<template v-else>
			<a
				:class="{
					[$style.btn]: true,
					[$style.btnDisabled]: isSoldOut,
					[$style.btnBlocked]: isControlBlocked,
					[$style.btnSelected]: selected > 0
				}"
				:href="isSoldOut || isControlBlocked ? 'javascript:void(0)' : mapZoneUrl"
			>
				<template v-if="selected > 0">
					<T text="_SELECTED_KEY_"/>
					({{ selected }})
				</template>
				<template v-else>
					<T text="_CHOOSE_SEATS_"/>
				</template>
			</a>
		</template>
	</div>
</template>

<script setup>

import { computed, defineProps, defineEmits } from 'vue';
import { useHallMap } from '@vue/ticket-office/casual/composable/useHallMap';
import T from '@vue/t';
import NoMobile from '@vue/no-mobile';
import Mobile from '@vue/mobile';
import { useCurrency } from '@vue/ticket-office/casual/composable/useCurrency';
import { useBlocked } from '@vue/composable/useBlocked';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import SvgIcon from '@vue/svg-icon';

const props = defineProps([
	'idEventOfferGroup',
	'offerList',
	'hiddenPriceMode',
	'ageLimit',
	'crossedPrice',
	'price',
	'discountAccelerateName',
	'customAccelerateText',
]);

const emit = defineEmits([
	'change'
]);

const hallMap = useHallMap();
const currency = useCurrency();
const basket = useBasket();
const { isBlocked } = useBlocked();
const isControlBlocked = computed(() => isBlocked('CASUAL_TICKET_OFFICE:SELECTION_BLOCK'));
const isSoldOut = computed(() => props['offerList'].reduce((sum, offer) => sum + offer['availableCount'], 0) === 0);
const hasAppliedPromoCode = computed(() => props['offerList'].filter(offer => offer['hasAppliedPromoCode']).length);
const discount = computed(() => props.crossedPrice
	? Math.round(100 - (props.price.min * 100 / props.crossedPrice))
	: null
);
const selected = computed(() => basket.getBasketItems().value
	.filter(basketItem => Number(basketItem.idEventOfferGroup) === Number(props.idEventOfferGroup)).length
);
const mapZoneUrl = computed(() => {
	const svgElementIdList = Array.from(
		new Set(props['offerList'].map(({ svgElementId }) => svgElementId))
	);

	return hallMap.getMapZoneUrl(svgElementIdList.join());
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.groupedOffer {
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
	align-items: center;
	gap: 8px;
}

.subInfoWrap {
	flex-wrap: wrap;
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

.ages {
	white-space: nowrap;
	color: var(--Content-secondary);
	line-height: 18px;
	@media (min-width: $media-sm) {
		position: relative;
		top: 1px;
		font-size: 14px;
	}
}

.crossedPrice {
	flex: 0 0 auto;
	color: var(--Content-secondary);
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 18px;
	text-decoration: line-through;
	@media (min-width: $media-sm) {
		line-height: 20px;
		font-size: 16px;
	}
}

.price {
	flex: 0 0 auto;
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 18px;
	color: var(--Content-primary);
	@media (min-width: $media-sm) {
		font-size: 16px;
		line-height: 20px;
	}
}

.discount {
	flex: 0 0 auto;
	padding: 2px 6px;
	background: var(--Accent-success);
	border-radius: 4px;
	color: var(--Bg-default);
	text-align: center;
	font-size: 10px;
	font-style: normal;
	font-weight: 700;
	line-height: 14px;
	@media (min-width: $media-sm) {
		font-size: 12px;
	}
}

.promocodeIcon {
	width: 16px;
	height: 16px;
	background-color: var(--Bg-default);;
	border-radius: 3px;
	fill: var(--Accent-promo);
}

.accelerator {
	color: var(--Accent-promo);
	font-size: 11px;
	font-weight: 400;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	@media (min-width: $media-sm) {
		font-size: 14px;
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

.btnDisabled {
	border: 1px solid var(--Interaction-Disable-border);
	color: var(--Interaction-Disable-content);
	cursor: not-allowed;
}

.btnBlocked {
	opacity: 0.5;
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

</style>