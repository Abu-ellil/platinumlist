<template>
	<div :class="$style.container">
		<div
			:class="$style.top"
			:style="topStyle"
		>
			<BackBtn
				:backUrl="backUrl"
				:scope="scope"
				:idEventShow="idEventShow"
				:isCalendarVisible="isCalendarVisible"
				@backBtnClick="backBtnClick"
			/>
			<div
				v-if="hasValidPromoCode"
				:class="{
					[$style.topPromoCodeWrapper]: true,
					[$style.topPromoCodeWrapperVisible]: isTopPromoCodeWrapperVisible,
				}"
			>
				<slot name="promoCodeDesktop"></slot>
			</div>
		</div>
		<div
			:class="$style.bottom"
			:style="bottomSize"
			:ref="(el) => bottomRef = el"
		>
			<div
				:ref="(el) => calendarWrapperRef = el"
				:class="{
					[$style.calendar]: true,
					[$style.calendarVisible]: isCalendarVisible,
				}"
			>
				<CalendarDesktop
					:activeDate="targetActiveDate"
					:currency="currency"
					:showHijri="showHijri"
					:showByDateMap="showByDateMap"
					@select="calendarSelectDate"
					@controlClick="controlClick"
				/>
			</div>
			<div
				v-if="hasDateTime"
				:class="{
					[$style.dateTime]: true,
					[$style.dateTimeVisible]: isDateTimeVisible
				}"
			>
				<p :class="$style.title">
					<T text="_CHOOSE_DATE_AND_TIME_"/>
				</p>
				<div :class="$style.dateTimeBlock">
					<DateList
						:hasPicker="hasPicker"
						:tiles="tiles"
						:activeDate="targetActiveDate"
						:showHijri="showHijri"
						:promoCode="promoCode"
						@dateTileClick="(date) => {dayClick(date); calendarDayClick(date);}"
						@calendarClick="() => {toggleCalendar(); openDatepickerClick();}"
					/>
					<TimeList
						v-if="(options || []).length"
						:options="options"
						:activeDate="targetActiveDate"
						:idEventSession="targetIdEventSession"
						:currency="currency"
						:hasManyVenues="hasManyVenues"
						@timeClick="onTimeClick"
					/>
				</div>
				<ApplyBtn
					:idEventShow="targetIdEventShow"
					:isLoading="isLoading"
					@apply="applyShowSelect"
				/>
			</div>
			<div
				v-if="isConfirmOpen"
				:class="{
					[$style.confirm]: true,
					[$style.confirmVisible]: isConfirmVisible
				}"
				:ref="(el) => confirmWrapperRef = el"
			>
				<Confirm
					:open="isConfirmOpen"
					:isLoading="isConfirmLoading"
					btnCancel="_TICKETOFFICE__RESET_SELECTION_POPUP__NO_"
					btnConfirm="_RESET_"
					description="_MIXING_TICKETS_IS_NOT_ALLOWED_"
					title="_PLEASE_SELECT_TICKETS_ONE_CATEGORY_"
					@cancel="cancel"
					@confirm="confirm"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>

import { ref, computed, defineEmits, watch, defineProps } from 'vue';
import { useDatePickerTiles } from '@vue/date-picker/internal/useDatePickerTiles';
import { useDatePicker } from '@vue/date-picker/internal/useDatePicker';
import T from '@vue/t';
import BackBtn from '@vue/date-picker/internal/back-btn';
import ApplyBtn from '@vue/date-picker/internal/apply-btn';
import DateList from '@vue/date-picker/internal/date-list';
import TimeList from '@vue/date-picker/internal/time-list';
import CalendarDesktop from '@vue/date-picker/calendar/desktop';
import Confirm from '@vue/date-picker/internal/confirm';

const ANIMATION_DURATION = 200;

const props = defineProps([
	'activeDate',
	'idEventShow',
	'idEventSession',
	'showHijri',
	'promoCode',
	'hasValidPromoCode',
	'currency',
	'showByDateMap',
	'backUrl',
	'scope',
	'isBasketEmpty',
])

const emit = defineEmits([
	'backBtnClick',
	'apply',
	'calendarDayClick',
	'openDatepickerClick',
	'timeSlotSelected',
	'resetBasket',
]);

const {
	targetActiveDate,
	targetIdEventShow,
	targetIdEventSession,
	isCalendarVisible,
	isDateTimeVisible,
	isTopPromoCodeWrapperVisible,
	hasDateTime,
	options,
	topSize,
	bottomSize,
	oldBottomSize,
	setBottomSize,
	dayClick,
	selectTime,
	isConfirmOpen,
	isConfirmVisible,
	hasManyVenues,
	isLoading,
} = useDatePicker(props.activeDate, props.idEventShow, props.idEventSession, props.showByDateMap, props.currency);
const cents = false;
const {
	tiles,
	hasPicker
} = useDatePickerTiles(targetActiveDate, cents, props.showByDateMap, props.currency);
const bottomRef = ref(null);
const calendarWrapperRef = ref(null);
const confirmWrapperRef = ref(null);
const isConfirmLoading = ref(false);
const topStyle = computed(() => {
	let topStyle = {};
	if (isTopPromoCodeWrapperVisible.value) {
		topStyle.zIndex = '1';
	}

	return {
		...topStyle,
		...topSize.value
	}
});

const calendarDayClick = date => {
	emit('calendarDayClick', { 'date': date })
};

const openDatepickerClick = () => {
	emit('openDatepickerClick')
};

const toggleCalendar = () => new Promise((resolve, _) => {
	if (isCalendarVisible.value) {
		hasDateTime.value = true;
		isCalendarVisible.value = false;

		setBottomSize(oldBottomSize.value['height'], oldBottomSize.value['width']);
		setTimeout(() => {
			isTopPromoCodeWrapperVisible.value = true;
			isDateTimeVisible.value = true;
			setBottomSize();
			setTimeout(() => {
				resolve(true);
			}, ANIMATION_DURATION);
		}, ANIMATION_DURATION);
	} else {
		oldBottomSize.value['height'] = $(bottomRef.value).outerHeight();
		oldBottomSize.value['width'] = $(bottomRef.value).outerWidth();
		oldBottomSize.value['padding'] = parseInt($(bottomRef.value).css('padding'), 10);
		setBottomSize(oldBottomSize.value['height'], oldBottomSize.value['width']);

		isTopPromoCodeWrapperVisible.value = false;
		isDateTimeVisible.value = false;

		setTimeout(() => {
			setBottomSize(
				$(calendarWrapperRef.value).outerHeight() + (oldBottomSize.value['padding'] * 2),
				$(calendarWrapperRef.value).outerWidth() + (oldBottomSize.value['padding'] * 2)
			);
			hasDateTime.value = false;
			isCalendarVisible.value = true;
		}, ANIMATION_DURATION);
	}
});

const toggleConfirm = () => {
	if (isConfirmOpen.value) {
		isConfirmVisible.value = false;
		hasDateTime.value = true;
		setBottomSize(oldBottomSize.value['height'], oldBottomSize.value['width']);
		setTimeout(() => {
			isConfirmOpen.value = false;
			isDateTimeVisible.value = true;
			isTopPromoCodeWrapperVisible.value = true;

			setBottomSize();
		}, ANIMATION_DURATION);

	} else {
		isDateTimeVisible.value = false;
		isTopPromoCodeWrapperVisible.value = false;
		isConfirmOpen.value = true;

		oldBottomSize.value['height'] = $(bottomRef.value).outerHeight();
		oldBottomSize.value['width'] = $(bottomRef.value).outerWidth();
		oldBottomSize.value['padding'] = parseInt($(bottomRef.value).css('padding'), 10);
		setBottomSize(oldBottomSize.value['height'], oldBottomSize.value['width']);
		setTimeout(() => {
			setBottomSize(
				$(confirmWrapperRef.value).outerHeight() + (oldBottomSize.value['padding'] * 2),
				$(confirmWrapperRef.value).outerWidth() + (oldBottomSize.value['padding'] * 2)
			);

			isConfirmVisible.value = true;
			hasDateTime.value = false;
		}, ANIMATION_DURATION);
	}
}

const controlClick = () => {
	setTimeout(syncCalendarBottomSize, 0)
}

const onTimeClick = (data) => {
	selectTime(data.idEventShow, data.idEventSession);
	emit('timeSlotSelected');
}

const applyShowSelect = () => {
	if (
		!targetIdEventShow.value
		|| !targetIdEventSession.value
		|| isLoading.value
	) {
		return;
	}
	if (props.isBasketEmpty || targetIdEventShow.value === props.idEventShow) {
		emit(
			'apply',
			targetActiveDate.value,
			targetIdEventShow.value,
			targetIdEventSession.value,
		);

		isLoading.value = true;
	} else {
		toggleConfirm();
	}
}

const confirm = () => {
	if (isConfirmLoading.value) {
		return;
	}
	isConfirmLoading.value = true;
	emit('resetBasket');
};

const cancel = () => {
	if (isConfirmLoading.value) {
		return;
	}
	targetActiveDate.value = props.activeDate;
	targetIdEventShow.value = props.idEventShow;
	targetIdEventSession.value = props.idEventSession;
	toggleConfirm();
};

const syncCalendarBottomSize = () => {
	setBottomSize(
		$(calendarWrapperRef.value).outerHeight() + (oldBottomSize.value['padding'] * 2),
		$(calendarWrapperRef.value).outerWidth() + (oldBottomSize.value['padding'] * 2)
	);
}

const calendarSelectDate = (date) => {
	toggleCalendar().then(() => dayClick(date));
	calendarDayClick(date);
}

const backBtnClick = () => {
	if (isCalendarVisible.value) {
		toggleCalendar();
		return;
	}
	if (isConfirmOpen.value) {
		toggleConfirm();
		return;
	}
	emit('backBtnClick');
}

watch(() => isCalendarVisible.value, () => {
	if (isCalendarVisible.value) {
		window.addEventListener('resize', syncCalendarBottomSize);
	} else {
		window.removeEventListener('resize', syncCalendarBottomSize);
	}
})

watch(() => props.isBasketEmpty, () => {
	if (props.isBasketEmpty && isConfirmOpen.value) {
		isConfirmLoading.value = false;
		toggleConfirm();
		applyShowSelect();
	}
})

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 16px;
	align-items: center;
	height: 100%;
}

.top {
	display: flex;
	align-self: flex-start;
	justify-content: space-between;
	width: 100%;
	padding: 0;
	box-sizing: border-box;
	transition: 200ms;
}

.topPromoCodeWrapper {
	position: relative;
	display: flex;
	transform: translateY(200%);
	opacity: 0;
	transition: 200ms;
}

.topPromoCodeWrapperVisible {
	opacity: 1;
	transform: translateY(0);
}

.bottom {
	position: relative;
	background-color: var(--Bg-default);
	padding: 40px;
	border-radius: 16px;
	box-shadow: 0 0 2px 0 rgba(96, 128, 159, 0.08), 0 4px 12px 0 rgba(96, 128, 159, 0.12);
	border: 1px solid var(--Bg-border);
	box-sizing: border-box;
	min-width: 688px;
	transition: 200ms;
	width: 100%;
}

.dateTime {
	display: flex;
	flex-direction: column;
	transform: translateX(-60px);
	opacity: 0;
	transition: 200ms;
}

.dateTimeVisible {
	transform: translateX(0);
	opacity: 1;
}

.title {
	font-weight: 700;
	font-size: 28px;
	line-height: 32px;
	margin-bottom: 24px;
}

.dateTimeBlock {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
}

.promoCodeWrapper {
	width: auto;
	position: absolute;
	bottom: -8px;
	z-index: 200;
	transform: translateY(100%);

	:global(.is_ltr) & {
		right: 0;
	}

	:global(.is_rtl) & {
		left: 0;
	}
	@keyframes promoCode {
		from {
			opacity: 0;
			transform: translateY(calc(100% + 40px));
		}
		to {
			opacity: 1;
			transform: translateY(100%);
		}
	}

	animation: promoCode 200ms ease-in;

	&.promoCodeEnterFrom {
		transition: 200ms ease-out;
		opacity: 0;
		transform: translateY(calc(100% + 40px));
	}

	&.promoCodeEnterActive {
		opacity: 1;
		transform: translateY(100%);
	}

	&.promoCodeLeaveActive {
		transition: 200ms ease-in;
		opacity: 1;
		transform: translateY(100%);
	}

	&.promoCodeLeaveTo {
		opacity: 0;
		transform: translateY(calc(100% + 40px));
	}
}

.calendar {
	position: absolute;
	top: 40px;
	left: 40px;
	transform: translateX(60px);
	opacity: 0;
	transition: 200ms;
	@media (min-width: $media-sm) {
		right: 40px;
		max-width: 608px;
	}
	@media (min-width: $media-md) {
		right: auto;
		max-width: unset;
	}
}

.calendarVisible {
	transform: translate(0);
	opacity: 1;
}

.confirm {
	display: flex;
	flex-direction: column;
	transform: translateX(-60px);
	opacity: 0;
	transition: 200ms;
	position: absolute;
	top: 40px;
	left: 40px;
	right: 40px;
}

.confirmVisible {
	transform: translateX(0);
	opacity: 1;
}

</style>