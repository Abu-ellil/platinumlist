<template>
	<div :class="$style.container">
		<div
			:class="{
				[$style.top]: true,
				[$style.topVisible]: isTopVisible,
			}"
			:style="cssVars"
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
					[$style.promoCodeBtnWrapper]: true,
					[$style.promoCodeBtnWrapperVisible]: isTopPromoCodeWrapperVisible,
				}"
			>
				<PromoCodeBtn
					:appliedPromocode="promoCode"
					:isOpen="isPromoCodeOpen"
					@click="togglePromoCode"
				/>
			</div>
		</div>
		<template v-if="isPromoCodeOpen">
			<div
				:class="{
					[$style.bottom]: true,
					[$style.bottomVisible]: isPromoCodeVisible,
				}"
			>
				<slot name="promoCodeContent"></slot>
			</div>
		</template>
		<template v-else>
			<div
				ref="bottomRef"
				:class="{
					[$style.bottom]: true,
					[$style.bottomVisible]: isDatePickerVisible,
				}"
				:style="bottomSize"
			>
				<div
					ref="calendarWrapperRef"
					:class="{
						[$style.calendar]: true,
						[$style.calendarVisible]: isCalendarVisible,
					}"
				>
					<CalendarMobile
						:activeDate="targetActiveDate"
						:currency="currency"
						:showHijri="showHijri"
						:showByDateMap="showByDateMap"
						@select="calendarSelectDate"
					/>
				</div>
				<div :class="$style.datePicker">
					<div
						v-if="hasDateTime"
						:class="{
							[$style.titleAndDateTimeBlock]: true,
							[$style.titleAndDateTimeBlockVisible]: isDateTimeVisible,
						}"
					>
						<p :class="$style.title">
							<T text="_CHOOSE_DATE_AND_TIME_"/>
						</p>
						<div :class="$style.dateTimeBlock">
							<DateList
								:activeDate="targetActiveDate"
								:hasPicker="hasPicker"
								:promoCode="promoCode"
								:showHijri="showHijri"
								:tiles="tiles"
								@calendarClick="() => {toggleCalendar(); openDatepickerClick()}"
								@dateTileClick="(date) => {dayClick(date); calendarDayClick(date);}"
							/>
							<TimeList
								:activeDate="targetActiveDate"
								:idEventSession="targetIdEventSession"
								:options="options"
								:currency="currency"
								:hasManyVenues="hasManyVenues"
								@timeClick="onTimeClick"
							/>
						</div>
					</div>
					<div :class="{
							[$style.applyBtnWrapper]: true,
							[$style.applyBtnWrapperVisible]: isDateTimeVisible,
						}"
					>
						<ApplyBtn
							v-if="hasDateTime"
							:idEventShow="targetIdEventShow"
							:isLoading="isLoading"
							@apply="applyShowSelect"
						/>
					</div>
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
		</template>
	</div>
</template>

<script setup>

import { ref, defineEmits, onMounted, nextTick, onBeforeMount, defineProps, computed, watch } from 'vue';
import { useDatePickerTiles } from '@vue/date-picker/internal/useDatePickerTiles';
import { useDatePicker } from '@vue/date-picker/internal/useDatePicker';
import T from '@vue/t';
import BackBtn from '@vue/date-picker/internal/back-btn';
import PromoCodeBtn from '@vue/promocode/v2/btn';
import ApplyBtn from '@vue/date-picker/internal/apply-btn';
import DateList from '@vue/date-picker/internal/date-list';
import TimeList from '@vue/date-picker/internal/time-list';
import CalendarMobile from '@vue/date-picker/calendar/mobile';
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
	'isPromoCodeOpen',
	'isBasketEmpty',
	'topGap',
])

const emit = defineEmits([
	'backBtnClick',
	'apply',
	'calendarDayClick',
	'openDatepickerClick',
	'timeSlotSelected',
	'resetBasket',
	'togglePromoCode',
]);

const {
	targetActiveDate,
	targetIdEventShow,
	targetIdEventSession,
	isCalendarVisible,
	isDateTimeVisible,
	isTopVisible,
	isDatePickerVisible,
	isPromoCodeVisible,
	isTopPromoCodeWrapperVisible,
	hasDateTime,
	options,
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
const isConfirmLoading = ref(false);
const cents = false;
const {
	tiles,
	hasPicker
} = useDatePickerTiles(targetActiveDate, cents, props.showByDateMap, props.currency);
const bottomRef = ref(null);
const calendarWrapperRef = ref(null);
const confirmWrapperRef = ref(null);
const isPromoCodeOpen = ref(props.isPromoCodeOpen);
const cssVars = computed(() => {
	return {
		'--top': props.topGap + 'px'
	}
});

const calendarDayClick = date => emit('calendarDayClick', { 'date': date });

const openDatepickerClick = () => emit('openDatepickerClick');

const togglePromoCode = () => emit('togglePromoCode')

const togglePromoCodeAnimation = (isOpen) => {
	if (!isOpen) {
		isPromoCodeVisible.value = false;

		setTimeout(() => {
			isPromoCodeOpen.value = false;

			setTimeout(() => {
				isDatePickerVisible.value = true;
				isTopVisible.value = true;
			}, ANIMATION_DURATION);
		}, ANIMATION_DURATION);
	} else {
		isDatePickerVisible.value = false;
		isTopVisible.value = false;

		setTimeout(() => {
			isPromoCodeOpen.value = true;

			setTimeout(() => {
				isPromoCodeVisible.value = true;
			}, ANIMATION_DURATION);
		}, ANIMATION_DURATION);
	}
};

const toggleCalendar = () => new Promise((resolve, _) => {
	if (isCalendarVisible.value) {
		hasDateTime.value = true;
		isCalendarVisible.value = false;

		setBottomSize(oldBottomSize.value['height']);
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
		oldBottomSize.value['padding'] = $(bottomRef.value).outerHeight() - $(bottomRef.value).height();
		setBottomSize(oldBottomSize.value['height']);

		isTopPromoCodeWrapperVisible.value = false;
		isDateTimeVisible.value = false;

		setTimeout(() => {
			setBottomSize($(calendarWrapperRef.value).outerHeight() + oldBottomSize.value['padding']);
			hasDateTime.value = false;
			isCalendarVisible.value = true;
		}, ANIMATION_DURATION);
	}
});

const toggleConfirm = () => {
	if (isConfirmOpen.value) {
		isConfirmVisible.value = false;
		hasDateTime.value = true;
		setBottomSize(oldBottomSize.value['height']);
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
		oldBottomSize.value['padding'] = parseInt($(bottomRef.value).css('padding'), 10);
		setBottomSize(oldBottomSize.value['height']);
		setTimeout(() => {
			setBottomSize($(confirmWrapperRef.value).outerHeight() + (oldBottomSize.value['padding'] * 2));

			isConfirmVisible.value = true;
			hasDateTime.value = false;
		}, ANIMATION_DURATION);
	}
}

const scrollTop = () => $(document).scrollTop(0);

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
	if (props.isBasketEmpty || Number(targetIdEventShow.value) === Number(props.idEventShow)) {
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

const calendarSelectDate = (date) => {
	toggleCalendar().then(() => dayClick(date));
	calendarDayClick(date);
}

const backBtnClick = () => {
	if (props.isPromoCodeOpen) {
		togglePromoCode();
		return;
	}
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

onBeforeMount(() => {
	isTopVisible.value = false;
	isDatePickerVisible.value = false;
})

onMounted(() => {
	nextTick(() => {
		isTopVisible.value = true;
		isDatePickerVisible.value = true;

		//prevent iOS scroll on load, which can lead to header hiding
		$(document).on('scroll', scrollTop);
		setTimeout(() => {
			$(document).off('scroll', scrollTop);
		}, 500);
	})
})

watch(() => props.isPromoCodeOpen, (isOpen) => {
	togglePromoCodeAnimation(isOpen);
});

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
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding-top: 8px;
}

.top {
	position: fixed;
	top: var(--top);
	margin-top: 16px;
	display: flex;
	align-self: flex-start;
	justify-content: space-between;
	width: 100%;
	padding: 0 16px;
	box-sizing: border-box;
	transform: translateY(-200%);
	transition: 200ms;
	opacity: 0;
}

.promoCodeBtnWrapper {
	position: relative;
	display: flex;
	z-index: 200;
	transform: translateY(-200%);
	opacity: 0;
	transition: 200ms;
}

.promoCodeBtnWrapperVisible {
	opacity: 1;
	transform: translateY(0);
}

.bottom {
	background-color: var(--Bg-default);
	padding: 24px 20px 16px;
	border-radius: 24px 24px 0 0;
	box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.06), 0px -1px 8px 0px rgba(0, 0, 0, 0.06);
	box-sizing: border-box;
	width: 100%;
	transform: translateY(100%);
	transition: 200ms;
}

.bottomVisible,
.topVisible {
	transform: translateY(0);
	opacity: 1;
}

.datePicker {
	display: flex;
	flex-direction: column;
}

.title {
	font-size: 24px;
	font-weight: 700;
	line-height: 28px;
	margin-bottom: 16px;
}

.dateTimeBlock {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
}

.titleAndDateTimeBlock {
	transform: translateX(-60px);
	opacity: 0;
	transition: 200ms;
}

.titleAndDateTimeBlockVisible {
	transform: translateX(0);
	opacity: 1;
}

.applyBtnWrapper {
	transform: translateY(200%);
	opacity: 0;
	transition: 200ms;
}

.applyBtnWrapperVisible {
	transform: translateY(0);
	opacity: 1;
}

.calendar {
	position: absolute;
	top: 24px;
	left: 20px;
	right: 20px;
	transform: translateX(60px);
	opacity: 0;
	transition: 200ms;
}

.calendarVisible {
	transform: translateX(0);
	opacity: 1;
}

.confirm {
	display: flex;
	flex-direction: column;
	transform: translateX(-60px);
	opacity: 0;
	transition: 200ms;
	position: absolute;
	top: 24px;
	left: 20px;
	right: 20px;
}

.confirmVisible {
	transform: translateX(0);
	opacity: 1;
}

</style>