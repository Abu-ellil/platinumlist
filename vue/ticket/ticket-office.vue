<template>
	<div>
		<div :class="[$style.headerWrapper, 'container2', 'padded']">
			<template v-if="showBackButton && !store.exp10333AltVariant">
				<template v-if="isB2c">
					<a :class="$style.headerBack"
					   href="javascript:void(0)"
					   data-b2c-casual-ticket-office-back
					>
						<SvgIcon icon="arrow-left-rounded"/>
					</a>
				</template>
				<template v-else>
					<a :class="$style.headerBack" :href="backUrl">
						<SvgIcon icon="arrow-left-rounded"/>
					</a>
				</template>
			</template>
			<div :class="$style.titleWrapper">
				<DotDotDot
					:class="$style.title"
					:text="title"
					tag="h1"
				/>
				<p v-if="selectedOptionDateTime && selectedOptionVenue" :class="$style.selectedOptionInfo">
					<span v-if="isDateFeatured" :class="$style.selectedOptionDateTime">
						<SvgIcon icon="16-kit-clock"/>
						<span>{{ selectedOptionDateTime }}</span>
					</span>
					<span :class="$style.selectedOptionVenue">
						<SvgIcon icon="16-kit-geo-mark"/>
						<span :class="$style.selectedOptionVenueText">{{ selectedOptionVenue }}</span>
					</span>
				</p>
			</div>
			<div :class="$style.promoCodeWrapper">
				<PromoCodeDesktop v-if="hasValidPromoCode"/>
				<PromoCodeMobile v-if="hasValidPromoCode && !store.exp10333AltVariant"/>
			</div>
		</div>
		<div :class="[
				$style.content,
				'container2',
				'padded',
				{
					[$style.contentWithFooter]: hasFooter,
				}
			]"
		>
			<template v-if="isDateFeatured">
				<div :class="{
					[$style.timeOptions]: true,
					[$style.timeOptionsReducedMargin]: hasTicketOfficePageTooltip,
				}"
				>
					<TimeOptionsMobile @datePickerClick="toggleDatePicker"/>
					<TimeOptionsDesktop @datePickerClick="toggleDatePicker"/>
				</div>
			</template>
			<div
				v-if="hasTicketOfficePageTooltip"
				:class="$style.alignedPopover"
			>
				<AlignedPopover  @open="onPopoverOpen"/>
			</div>
			<div
				v-if="hasHallMapBtn || hasDiscountsBtn"
			     :class="{
					[$style.discountAndFloorMapWrapper]: true,
					[$style.discountAndFloorMapWrapperBottomSmall]: hasOnlyOneOfferSection,
				}"
			>
				<template v-if="hasHallMapBtn">
					<NoMobile>
						<div :class="$style.floorMapLink">
							<FloorMapDesktop :href="activeHallMapUrl" />
						</div>
					</NoMobile>
					<Mobile>
						<div data-floor-map-link-shifted
						     :class="{
								[$style.floorMapLink]: true,
								[$style.floorMapLinkShifted]: hasFooter,
							}"
						>
							<FloorMapMobile :href="activeHallMapUrl" />
						</div>
					</Mobile>
				</template>
				<DiscountPopup/>
			</div>
			<OfferList/>
		</div>
		<div v-if="hasFooter" :class="$style.footer" data-casual-ticket-office-footer>
			<FooterDesktop/>
			<FooterMobile/>
		</div>
		<DatePickerPopup
			:isDatePickerOpen="isDatePickerOpen"
			@toggle="toggleDatePicker"
			@apply="apply"
		/>
		<div v-if="isLoading" :class="$style.overlay"></div>
	</div>
</template>

<script setup>

import { computed, watch, onMounted } from 'vue';
import Mobile from '@vue/mobile';
import NoMobile from '@vue/no-mobile';
import SvgIcon from '@vue/svg-icon';
import OfferList from '@vue/ticket-office/casual/components/offer-list';
import AlignedPopover from '@vue/ticket-office/casual/components/aligned-popover/popover';
import FloorMapDesktop from '@vue/ticket-office/casual/components/floor-map/desktop';
import FloorMapMobile from '@vue/ticket-office/casual/components/floor-map/mobile';
import FooterDesktop from '@vue/ticket-office/casual/components/footer/desktop';
import FooterMobile from '@vue/ticket-office/casual/components/footer/mobile';
import DatePickerPopup from '@vue/ticket-office/casual/components/date-picker/date-picker-popup';
import PromoCodeDesktop from '@vue/ticket-office/casual/components/promocode/desktop';
import PromoCodeMobile from '@vue/ticket-office/casual/components/promocode/mobile';
import TimeOptionsMobile from '@vue/ticket-office/casual/components/time-options/mobile';
import TimeOptionsDesktop from '@vue/ticket-office/casual/components/time-options/desktop';
import DiscountPopup from '@vue/ticket-office/casual/components/discount/popup';
import DotDotDot from '@vue/dot-dot-dot';
import { useEventInfo } from '@vue/ticket-office/casual/composable/useEventInfo';
import { useStore } from '@vue/ticket-office/casual/store';
import { useLoader } from '@vue/ticket-office/casual/composable/useLoader';
import { useHallMap } from "@vue/ticket-office/casual/composable/useHallMap";
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useScope } from '@vue/ticket-office/casual/composable/useScope';
import { useGTM } from '@vue/ticket-office/casual/composable/useGTM';
import { useDatePicker } from '@vue/ticket-office/casual/components/date-picker/internal/useDatePicker';
import { usePromocode } from '@vue/ticket-office/casual/composable/usePromocode';
import { useDiscount } from '@vue/ticket-office/casual/composable/useDiscount';

const {
	title,
	hasTicketOfficePageTooltip,
	selectedOptionDateTime,
	selectedOptionVenue,
	isDateFeatured
} = useEventInfo();
const { activeHallMapUrl, pushGTMSeatsMapAvailable, hasHallMapBtn } = useHallMap();
const { hasValidPromoCode } = usePromocode();
const { hasDiscountsBtn } = useDiscount();
const store = useStore();
const loader = useLoader();
const isLoading = computed(() => loader.loading);
const backUrl = store.backUrl;
const hasResale = computed(() => store.hasResale);
const basket = useBasket();
const scope = useScope();
const isB2c = computed(() => scope.isB2c());
const hasFooter = computed(() => !basket.isEmpty().value);
const hasOnlyOneOfferSection = computed(() => store.offerTree
	&& store.offerTree['sectionList']
	&& store.offerTree['sectionList'].length === 1
);
const showBackButton = store.showBackButton;
const { pushGA4EventsCustomToDataLayer, pushDataLayer } = useGTM();
const {
	isDatePickerOpen,
	toggleDatePicker,
	apply,
} = useDatePicker();

const onPopoverOpen = () => {
	pushGA4EventsCustomToDataLayer('hintSharingShown');
}

watch(() => activeHallMapUrl.value, () => {
	pushGTMSeatsMapAvailable();
});

watch(() => hasResale.value, (hasResale) => {
	pushDataLayer({ 'has_resale': hasResale });
});

onMounted(() => {
	pushDataLayer({ 'has_resale': hasResale.value });
	pushGTMSeatsMapAvailable();
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.headerWrapper {
	display: flex;
	position: relative;
	align-items: center;
	justify-content: space-between;
	margin-top: 26px;
	@media (min-width: $media-sm) {
		margin-top: 40px;
	}
}

.headerBack {
	position: relative;
	flex: 0 0 auto;
	align-items: flex-start;
	top: 0;
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;

	&:hover {
		:global(.icon) {
			stroke: var(--Interaction-Secondary-content_hover);
		}
		cursor: pointer;
	}

	:global(.is_rtl) & {
		right: -10px;
	}

	:global(.is_ltr) & {
		left: -10px;
	}

	:global(.icon) {
		width: 24px;
		height: 24px;
		stroke: var(--Content-secondary);

		:global(.is_rtl) & {
			transform: rotate(180deg);
		}
	}

	@media (min-width: $media-sm) {
		position: absolute;
		align-items: center;
		top: -6px;
		width: 40px;
		height: 40px;

		:global(.is_rtl) & {
			right: -48px;
		}

		:global(.is_ltr) & {
			left: -48px;
		}

		:global(.icon) {
			padding-left: 8px;
		}
	}
}

.titleWrapper{
	display: flex;
	flex-direction: column;
	gap: 2px;
	flex: 1 1 auto;
	overflow: hidden;

	:global(.is_ltr) & {
		margin-right: 13px;
	}

	:global(.is_rtl) & {
		margin-left: 13px;
	}

	@media (min-width: $media-sm) {
		gap: 4px;
	}
}

.title {
	font-style: normal;
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	color: var(--Content-primary);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	@media (min-width: $media-sm) {
		font-size: 24px;
		line-height: 30px;
	}
}

.subTitle {
	font-style: normal;
	font-size: 14px;
	line-height: 26px;
	color: var(--Content-secondary);
	@media (min-width: $media-sm) {
		font-size: 16px;
	}
}

.selectedOptionInfo {
	font-size: 14px;
	line-height: 18px;
	display: flex;
	gap: 16px;
	@media (min-width: $media-sm) {
		font-size: 16px;
		line-height: 22px;
	}
}

.selectedOptionDateTime {
	flex: 0 0 auto;
}

.selectedOptionVenue {
	color: var(--Content-primary);
	overflow: hidden;
}

.selectedOptionVenueText {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.selectedOptionDateTime,
.selectedOptionVenue {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	:global(.icon) {
		display: none;
		flex: 0 0 auto;
		width: 16px;
		height: 16px;
		fill: var(--Content-secondary);
		@media (min-width: $media-sm) {
			display: block;
		}
	}
}

.promoCodeWrapper{
	align-self: flex-start;
	flex: 0 0 auto;
}

.alignedPopover {
	margin-bottom: 8px;
	@media (min-width: $media-sm) {
		display: flex;
		margin-bottom: 16px;
	}
}

.content {
	position: relative;
	margin-top: 17px;
	margin-bottom: 40px;
	@media (min-width: $media-sm) {
		margin-top: 20px;
		margin-bottom: 80px;
	}
}

.contentWithFooter {
	margin-bottom: 117px;
	@media (min-width: $media-sm) {
		margin-bottom: 177px;
	}
}

.calendar {
	margin-bottom: 16px;
	@media (min-width: $media-sm) {
		margin-bottom: 40px;
	}
}

.timeOptions {
	margin-bottom: 12px;
	@media (min-width: $media-sm) {
		margin-bottom: 16px;
	}
}

.timeOptionsReducedMargin {
	@media (min-width: $media-sm) {
		margin-bottom: 24px;
	}
}

.floorMapLink {
	width: max-content;
	z-index: 1;
	position: fixed;
	bottom: 16px;
	left: 50%;
	transform: translateX(-50%);
	@media (min-width: $media-sm) {
		flex: 1 1 auto;
		width: 100%;
		position: static;
		transform: none;
	}
}

.floorMapLinkShifted {
	bottom: 89px;
	@media (min-width: $media-xxxs) {
		bottom: 97px;
	}
}

.discountAndFloorMapWrapper {
	display: flex;
	gap: 16px;
	margin-bottom: 12px;
	@media (min-width: $media-sm) {
		margin-bottom: 32px;
	}
}

.discountAndFloorMapWrapperBottomSmall {
	margin-bottom: 16px;
}

.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	z-index: 4002;
}

.overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: var(--Bg-default);
	opacity: 0.4;
	z-index: 10000;
	@keyframes casual-ticket-office-overlay {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 0.4;
		}
	}
	animation: 200ms ease-in casual-ticket-office-overlay;
}

</style>