<template>
	<div
		:class="{
			[$style.timeRow]: true,
			[$style.timeRowFade]: isTimeFadeVisible,
		}"
		:style="timeRowVisible"
	>
		<ul :class="$style.timeList" ref="timeListRef" @scroll="setTimeFadeVisibility">
			<template v-for="option in options">
				<li :class="$style.timeListItem">
					<button
						:class="{
							[$style.timeListItemBtn]: true,
							[$style.timeListItemBtnDisabled]: option.isSoldOut,
							[$style.timeListItemBtnActive]: option.idEventSession === idEventSession,
							[$style.timeListItemBtnWithPromoCode]: option['hasAppliedPromoCode'],
						}"
						@click="timeClick(option.idEventShow, option.idEventSession)"
					>
						<span
							:class="{
								[$style.timeListItemCheckmark]: true,
								[$style.timeListItemCheckmarkReducedPadding]: hasManyVenues
							}"
						>
							<SvgIcon icon="16-kit-checkmark"/>
						</span>
						<span
							:class="{
								[$style.timeListItemInfo]: true,
								[$style.timeListItemInfoReducedPadding]: hasManyVenues,
							}"
						>
							<span
								:class="{
									[$style.timeListItemRow]: true,
									[$style.timeListItemRowWrap]: option['isShowTimeInRangeMode'],
								}"
							>
								<span :class="$style.timeListItemTime">{{ option['timeRange'] }}</span>
								<span :class="$style.priceBlock">
									<SvgIcon
										v-if="option['hasAppliedPromoCode']"
										icon="16-kit-percent-bg"
										:class="$style.promoCodeIcon"
									/>
									<span
										v-if="option['lowestPrice'] !== null"
										:class="$style.timeListItemLowestPrice"
									>
										{{ option['lowestPrice'] }} {{ currency }}
									</span>
								</span>
								<span
									v-if="option['isSoldOut']"
									:class="$style.timeListItemSoldOut"
								>
									<T text="_SOLD_OUT_"/>
								</span>
								<span
									v-else-if="option['distinctiveFeatures']"
									:class="$style.timeListItemDescription"
								>
									{{ option['distinctiveFeatures'] }}
								</span>
							</span>
							<span
								v-if="hasManyVenues"
								:class="$style.timeListItemRow"
							>
								<span v-if="hasManyVenues" :class="$style.venueRow">
									<span :class="$style.venueName">
										<SvgIcon icon="16-kit-geo-mark"/>
										{{ option.venueName }}
									</span>
									<a
										v-if="option.venueMapUrl"
										:class="$style.venueLink"
										:href="option.venueMapUrl"
										target="_blank"
									>
										<T text="_SHOW_MAP_"/>
									</a>
								</span>
							</span>
						</span>
					</button>
				</li>
			</template>
		</ul>
	</div>
</template>

<script setup>

import { ref, defineEmits, defineProps, onMounted, watch, computed } from 'vue';
import SvgIcon from '@vue/svg-icon';
import T from '@vue/t';

const emit = defineEmits([
	'timeClick'
]);

const props = defineProps([
	'options',
	'activeDate',
	'idEventSession',
	'currency',
	'hasManyVenues',
]);

const isTimeFadeVisible = ref(false);
const activeDate = computed(() => props.activeDate);
const timeListRef = ref(null);
const height = ref(0);
const timeRowVisible = computed(() => height.value ? {'opacity': '1', 'height':`${height.value}px`} : {})

const setTimeFadeVisibility = () => {
	if (timeListRef.value) {
		isTimeFadeVisible.value =  timeListRef.value.scrollHeight > Math.abs(timeListRef.value.scrollTop) + timeListRef.value.offsetHeight;
	}
}

const setRowHeight = () => height.value = $(timeListRef.value).outerHeight(true);

const timeClick = (idEventShow, idEventSession) => {
	emit('timeClick', { idEventShow: idEventShow, idEventSession: idEventSession })
}

watch(() => activeDate.value, () => {
	setTimeout(() => setTimeFadeVisibility(), 0);
	setTimeout(setRowHeight, 0);
})

onMounted(() => {
	setTimeFadeVisibility();
	if (activeDate.value) {
		setRowHeight();
	}
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.timeRow {
	transition: 200ms;
	opacity: 0;
	height: 0;
}

.timeRowFade {
	@media (min-width: $media-sm) {
		position: relative;

		&:after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 24px;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%);
			z-index: 1;
		}
	}
}

.timeList {
	position: relative;
	max-height: 220px;
	padding: 16px 0 24px;
	margin-bottom: -24px;
	overflow-y: scroll;
	scroll-behavior: smooth;
	transition: 200ms;

	@media (min-width: $media-sm) {
		max-height: 252px;
		padding: 24px 0 0;
		margin-bottom: 0;
	}

	&::-webkit-scrollbar {
		width: 8px;
		height: 64px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #D9D9D9;
		border-radius: 8px;
	}

	&::-webkit-scrollbar-track {
		margin: 16px 0 24px;
		@media (min-width: $media-sm) {
			margin: 24px 0 0;
		}
	}
}

.timeListItem + .timeListItem {
	.timeListItemInfo {
		border-top: 1px solid var(--Bg-border);
	}
}

.timeListItemBtn {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	width: 100%;

	&:not(.timeListItemBtnDisabled) {
		&:hover,
		&:focus-visible {
			.timeListItemTime {
				color: var(--Interaction-Secondary-content);
			}
		}
	}
}

.timeListItemTime {
	flex: 0 0 auto;
	font-size: 16px;
	line-height: 20px;
	transition: all 120ms ease-out;
}

.promoCodeAlign {
	margin: auto 0;
}

.priceBlock {
	display: flex;
	align-items: center;
	flex: 0 0 auto;
	gap: 4px;
}

.promoCodeIcon {
	width: 16px;
	height: 16px;
	fill: var(--Accent-promo);
	background-color: var(--Bg-default);
	border-radius: 3px;
	margin: auto 0;
}

.timeListItemLowestPrice {
	flex: 0 0 auto;
	color: var(--Content-secondary);
	font-size: 16px;
	line-height: 20px;
}

.timeListItemSoldOut {
	color: var(--Accent-warning);
	font-size: 14px;
	line-height: 20px;
}

.timeListItemInfo {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 8px;

	:global(.is_ltr) & {
		padding: 12px 8px 12px 0;
	}

	:global(.is_rtl) & {
		padding: 12px 0 12px 8px;
	}
}

.timeListItemInfoReducedPadding {
	:global(.is_ltr) & {
		padding: 8px 8px 8px 0;
	}

	:global(.is_rtl) & {
		padding: 8px 0 8px 8px;
	}
}

.timeListItemRow {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	row-gap: 4px;
	column-gap: 8px;
	width: 100%;
}

.timeListItemRowWrap {
	flex-wrap: wrap;

	.timeListItemDescription {
		width: 100%;
		@media (min-width: $media-sm) {
			width: auto;
		}
	}
}

.venueRow {
	display: flex;
	justify-content: space-between;
	width: 100%;
	font-size: 12px;
	line-height: 14px;
}

.venueName {
	display: flex;
	align-items: center;
	gap: 4px;
	color: var(--Content-primary);

	:global(.icon) {
		width: 16px;
		height: 16px;
		fill: var(--Content-secondary);
	}
}

.venueLink {
	color: var(--Interaction-Secondary-content);
}

.timeListItemRowWithTicketCount {
	@extend .timeListItemRow;
	font-size: 12px;
	line-height: 15px;
}

.timeListItemTicketCount {
	display: block;
	color: var(--Accent-warning);
}

.timeListItemBtnActive{
	.timeListItemCheckmark {
		opacity: 1;
	}

	.timeListItemTime {
		color: var(--Interaction-Secondary-content)
	}
}

.timeListItemCheckmark {
	display: flex;
	flex: 0 0 auto;
	justify-content: center;
	align-items: center;
	opacity: 0;
	height: 20px;
	padding: 12px 0;

	:global(.icon) {
		width: 16px;
		height: 16px;
		fill: var(--Interaction-Secondary-content);
	}
}

.timeListItemCheckmarkReducedPadding{
	padding: 8px 0;
}

.timeListItemDescription {
	font-size: 14px;
	line-height: 18px;
	overflow: hidden;
	color: var(--Content-accelerator);

	:global(.is_ltr) & {
		text-align: left;
	}

	:global(.is_rtl) & {
		text-align: right;
	}

	@media (min-width: $media-sm) {
		line-height: 20px;
	}
}

.timeListItemUpcoming {
	font-size: 12px;
	font-weight: 400;
	padding: 4px 8px;
	gap: 10px;
	margin-left: 12px;
	border-radius: 8px;
	color: var(--Interaction-Secondary-content);
	background-color: var(--Bg-default);

	@media (min-width: $media-md) {
		font-size: 12px;
	}
}

.timeListItemBtnWithPromoCode {
	gap: 8px;
}

</style>