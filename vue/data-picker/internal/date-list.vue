<template>
	<div :class="$style.dateRow">
		<ul :class="$style.dateList" ref="dateListRef" @scroll="setDateFadeVisibility">
			<template v-for="(tile, index) in tiles" :key="index">
				<li :class="$style.tile" :ref="(el) => setActiveTileRef(el, activeDate === tile.date)">
					<button
						:class="{
							[$style.tileButton]: true,
							[$style.tileButtonHijri]: showHijri,
							[$style.tileButtonActive]: activeDate === tile.date,
							[$style.tileButtonDisabled]: tile.isDisabled,
						}"
						@click="dateTileClick(tile.date)"
					>
						<SvgIcon
							v-if="tile.hasAppliedPromoCode"
							icon="16-kit-percent-bg"
							:class="$style.promoCode"
						/>
						<span :class="$style.weekDay">{{ tile.weekDay }}</span>
						<span :class="$style.monthDayNumber">
							{{ tile.monthDay }} {{ tile.monthName }}
						</span>
						<template v-if="showHijri">
							<span :class="$style.dayNumberHijriWrapper">
								<SvgIcon icon="16-kit-moon"/>
								<span>{{ tile.hijriDay }}</span>
							</span>
						</template>
						<template v-if="tile.label">
							<span :class="{
									[$style.dayLabel]: true,
									[$style.dayLabelSoldOut]: tile.isSoldOutDate
								}"
							>
								<span v-if="!tile.isDisabled"><T text="_FROM_"/>: </span>
								{{ tile.label }}
							</span>
						</template>
					</button>
				</li>
			</template>
		</ul>
		<template v-if="hasPicker">
			<div :class="$style.tileDatepicker">
				<div v-if="isPickerFadeVisible" :class="$style.calendarGradient"/>
				<button
					:class="[$style.tileButtonDatePicker]"
					@click="calendarClick"
				>
					<SvgIcon
						v-if="promoCode"
						icon="16-kit-percent-bg"
						:class="$style.promoCode"
					/>
					<span :class="$style.calendarIcon">
						<SvgIcon icon="24-kit-calendar" />
					</span>
				</button>
			</div>
		</template>
	</div>
</template>

<script setup>

import { ref, defineEmits, defineProps, onMounted, onUnmounted, watch } from 'vue';
import { useDateListAnimation } from '@vue/date-picker/internal/useDateListAnimation';
import SvgIcon from '@vue/svg-icon';
import T from '@vue/t';

const emit = defineEmits([
	'dateTileClick',
	'calendarClick',
]);

const props = defineProps([
	'hasPicker',
	'tiles',
	'activeDate',
	'showHijri',
	'promoCode',
]);

const isPickerFadeVisible = ref(props.hasPicker.value);

const {
	dateListRef,
	activeTileRef,
	syncDateListScroll,
} = useDateListAnimation();

const setDateFadeVisibility = () => {
	if (!dateListRef.value) return;
	isPickerFadeVisible.value = Math.abs(dateListRef.value.scrollLeft) + 1 < dateListRef.value.scrollWidth - dateListRef.value.clientWidth;
}

const setActiveTileRef = (el, isActive) => {
	if (isActive) {
		activeTileRef.value = el;
	}
}

const dateTileClick = (date) => emit('dateTileClick', date);

const calendarClick = (date) => emit('calendarClick', date);

onMounted(() => {
	setDateFadeVisibility();
	window.addEventListener("resize", setDateFadeVisibility);
	syncDateListScroll();
});

onUnmounted(() => {
	window.removeEventListener("resize", setDateFadeVisibility);
});

watch(() => activeTileRef.value, () => {
	syncDateListScroll();
})

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.dateRow {
	display: flex;
	align-items: stretch;
	gap: 4px;
	margin: -10px 0;
}

.dateList {
	position: relative;
	display: flex;
	flex-wrap: nowrap;
	flex: 1 1 auto;
	overflow-y: scroll;
	scroll-behavior: smooth;
	gap: 4px;
	margin: 0 -20px;
	padding: 10px 20px;

	&::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: $media-sm) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(0, auto));
		margin: 0 -10px;
		padding: 10px;
	}
}

.tile {
	flex: 1 1 auto;

	:global(.is_ltr) & {
		min-width: 72px;
	}

	:global(.is_rtl) & {
		min-width: 100px;
	}

	@media (min-width: $media-sm) {
		:global(.is_ltr) & {
			min-width: 98px;
		}

		:global(.is_rtl) & {
			min-width: 120px;
		}
	}
}

.promoCode {
	width: 16px;
	height: 16px;
	fill: var(--Accent-promo);
	background-color: var(--Bg-default);
	border-radius: 3px;
	position: absolute;
	top: -4px;

	:global(.is_ltr) & {
		right: -4px;
	}

	:global(.is_rtl) & {
		left: -4px;
	}
}

.tileDatepicker {
	flex: 0 0 auto;
	min-width: 60px;
	position: relative;
	padding: 10px 0;
	box-sizing: border-box;

	@media (min-width: $media-sm) {
		min-width: 98px;
	}
}

.tileButton {
	position: relative;
	display: flex;
	gap: 2px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	min-height: 72px;
	padding: 10px;
	box-shadow: 0 0 2px 0 rgba(96, 128, 159, 0.08),  0 3px 10px 0 rgba(96, 128, 159, 0.12);
	border-radius: 8px;
	border: 1px solid var(--Bg-border);
	background: var(--Bg-default);

	@media (min-width: $media-sm) {
		padding: 16px 8px;
		border-radius: 12px;
		min-height: 98px;
		&:hover:not(.tileButtonDisabled) {
			.monthDayNumber {
				color:  var(--Interaction-Secondary-content);
			}
		}
	}

	&:focus-visible {
		box-shadow: none;
		outline: 2px solid var(--Interaction-Focus-keyboard);
	}
}

.tileButtonHijri {
	padding: 6px;

	@media (min-width: $media-sm) {
		padding: 8px;
	}
}

.tileButtonDatePicker{
	@extend .tileButton;
	position: relative;
	z-index: 2;

	&:hover {
		.calendarIcon {
			:global(.icon) {
				fill: var(--Interaction-Secondary-content_hover);
			}
		}
	}
}

.tileButtonActive {
	box-shadow: none;
	border-color: var(--Interaction-Secondary-border);

	.monthDayNumber {
		color: var(--Interaction-Secondary-content);
	}
}

.calendarIcon {
	font-size: 0;

	:global(.icon) {
		width: 24px;
		height: 24px;
		fill: var(--Interaction-Secondary-content);
		transition: all 120ms ease-out;
		@media (min-width: $media-sm) {
			width: 26px;
			height: 26px;
		}
	}
}

.tileButtonDisabled {
	.weekDay {
		color: var(--Content-secondary);
	}

	.monthDayNumber {
		color: var(--Content-secondary);
	}
}

.weekDay {
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 14px;
	color: var(--Content-secondary);

	@media (min-width: $media-sm) {
		font-size: 16px;
		font-weight: 400;
		line-height: 20px;
		color: var(--Content-primary);
	}
}

.monthDayNumber {
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 20px;
	color: var(--Content-primary);
	white-space: nowrap;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: all 120ms ease-out;

	@media (min-width: $media-sm) {
		font-size: 18px;
		line-height: 24px;
	}
}

.monthDayNumberAr {
	@extend .monthDayNumber;
	display: flex;
	flex-direction: column;
	overflow: initial;
	text-overflow: initial;
	align-items: center;
	gap: 2px;

	@media(min-width: $media-sm) {
		gap: 4px;
	}

	& > span:first-child {
		font-size: 13px;
		@media(min-width: $media-sm) {
			font-size: 16px;
		}
	}
}

.dayNumberHijriWrapper {
	display: flex;
	align-items: center;
	font-size: 16px;
	font-weight: 400;
	line-height: 14px;
	gap: 2px;
	color: #009000;

	:global(.icon) {
		flex: 0 0 auto;
		width: 16px;
		height: 16px;
		fill: #009000;
	}
}

.dayLabel {
	min-height: 12px;
	font-style: normal;
	font-weight: 400;
	font-size: 10px;
	line-height: 12px;
	color: var(--Content-secondary);
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;

	@media (min-width: $media-sm) {
		font-size: 12px;
		line-height: 14px;
	}
}

.dayLabelSoldOut {
	color: var(--Accent-warning);
}

.calendarGradient {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	width: 64px;
	z-index: 1;

	:global(.is_ltr) & {
		background: linear-gradient(270deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);
		left: -48px;
	}

	:global(.is_rtl) & {
		background: linear-gradient(-270deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);
		right: -48px;
	}
}

</style>