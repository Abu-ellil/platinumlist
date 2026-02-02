<template>
	<NoMobile>
		<div
			v-if="(sessionList || []).length > 1"
			:class="$style.optionsRow"
			ref="optionsRowRef"
		>
			<template v-if="sessionCount > MAX_OPTION_COUNT">
				<UnitedTimeOption
					:selectedOptionDateTime="selectedOptionDateTime"
					@datePickerClick="datePickerClick"
				/>
			</template>
			<template v-else>
				<DatePickerBtn
					@datePickerClick="datePickerClick"
					@setDatePickerBtnRef="(el) => datePickerBtnRef = el"
				/>
				<div :class="$style.optionListWrapper">
					<div v-if="isPrevBtnVisible" :class="[$style.btnWrapper, $style.btnWrapperPrev]">
						<button
							:class="[$style.controlBtn, $style.controlBtnPrev]"
							ref="prevBtnRef"
							@click="scrollPrev"
						>
							<SvgIcon icon="24-kit-arrow-left"/>
						</button>
					</div>
					<div v-if="isNextBtnVisible" :class="[$style.btnWrapper, $style.btnWrapperNext]">
						<button
							:class="[$style.controlBtn, $style.controlBtnNext]"
							ref="nextBtnRef"
							@click="scrollNext"
						>
							<SvgIcon icon="24-kit-arrow-right"/>
						</button>
					</div>
					<ul
						:class="$style.optionList"
						ref="optionListRef"
						@scroll="setControlButtonsVisibility"
					>
						<template v-for="item in sessionList">
							<TimeOption
								:item="item"
								:idEventSession="idEventSession"
								:hasManyDates="hasManyDates"
								@selectOption="onSelectOption"
								@setActiveOptionRef="(el) => activeOptionRef = el"
							/>
						</template>
					</ul>
				</div>
			</template>
			<Confirm
				:open="isConfirmOpen"
				btnCancel="_TICKETOFFICE__RESET_SELECTION_POPUP__NO_"
				btnConfirm="_RESET_"
				description="_MIXING_TICKETS_IS_NOT_ALLOWED_"
				title="_PLEASE_SELECT_TICKETS_ONE_CATEGORY_"
				@cancel="cancel"
				@confirm="confirm"
			/>
		</div>
	</NoMobile>
</template>

<script setup>

import SvgIcon from '@vue/svg-icon';
import Confirm from '@vue/ticket-office/casual/components/common/confirm';
import TimeOption from '@vue/ticket-office/casual/components/time-options/internal/time-option';
import UnitedTimeOption from '@vue/ticket-office/casual/components/time-options/internal/united-time-option';
import DatePickerBtn from '@vue/ticket-office/casual/components/time-options/internal/date-picker-btn';
import NoMobile from '@vue/no-mobile';
import { defineEmits, onMounted, watch, onUnmounted } from 'vue';
import { useShowByDateMap } from '@vue/ticket-office/casual/composable/useShowByDateMap';
import { useEventInfo } from '@vue/ticket-office/casual/composable/useEventInfo';
import { useEventSession } from '@vue/ticket-office/casual/composable/useEventSession';
import { useGTM } from '@vue/ticket-office/casual/composable/useGTM';
import { useTimeOptions } from '@vue/ticket-office/casual/components/time-options/internal/useTimeOptions';
import { useDesktopAnimation } from '@vue/ticket-office/casual/components/time-options/internal/useDesktopAnimation';

const emit = defineEmits([
	'datePickerClick'
]);

const {
	sessionCount,
	hasManyDates,
	sessionList,
} = useShowByDateMap();

const {
	MAX_OPTION_COUNT,
	isConfirmOpen,
	confirm,
	cancel,
	selectOption,
} = useTimeOptions()

const {
	activeOptionRef,
	optionListRef,
	datePickerBtnRef,
	optionsRowRef,
	isPrevBtnVisible,
	isNextBtnVisible,
	prevBtnRef,
	nextBtnRef,
	syncOptionListScroll,
	scrollNext,
	scrollPrev,
	setControlButtonsVisibility,
} = useDesktopAnimation();

const { selectedOptionDateTime } = useEventInfo();
const { idEventSession } = useEventSession();
const { pushGA4EventsCustomToDataLayer } = useGTM();

const datePickerClick = () => emit('datePickerClick');

const onSelectOption = (selectedIdEventShow, selectedIdEventSession) => {
	pushGA4EventsCustomToDataLayer('timeSlotSelected');
	selectOption(selectedIdEventShow, selectedIdEventSession);
}

watch(() => activeOptionRef.value, () => {
	syncOptionListScroll();
})

onMounted(() => {
	syncOptionListScroll();
	setControlButtonsVisibility();
	window.addEventListener("resize", setControlButtonsVisibility);
});

onUnmounted(() => {
	window.removeEventListener("resize", setControlButtonsVisibility);
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.optionsRow {
	display: flex;
	gap: 16px;
	align-items: center;
}

.optionListWrapper {
	position: relative;
	overflow: hidden;
}

.optionList {
	display: flex;
	gap: 12px;
	overflow-y: scroll;
	scroll-behavior: smooth;
	margin: 0 -20px;
	padding: 0 20px;

	&::-webkit-scrollbar {
		display: none;
	}
}

.btnWrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	height: 100%;
	background: var(--Bg-default);
}

.btnWrapperPrev {
	:global(.is_ltr) & {
		left: -16px;
		padding-left: 8px;
	}

	:global(.is_rtl) & {
		right: -16px;
		padding-right: 8px;
	}
}

.btnWrapperNext {
	:global(.is_ltr) & {
		right: -16px;
		padding-right: 8px;
	}

	:global(.is_rtl) & {
		left: -16px;
		padding-left: 8px;
	}
}

.controlBtn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	padding: 11px;
	border-radius: 12px;
	border: 1px solid var(--Bg-border, rgba(96, 128, 159, 0.14));
	background: var(--Bg-default, #FFF);
	z-index: 1;
	position: relative;
	transition: all 120ms ease-out;

	:global(.icon) {
		fill: var(--Content-secondary);
		width: 24px;
		height: 24px;
	}

	&:hover {
		:global(.icon) {
			fill: var(--Interaction-Secondary-content);
		}
	}

	&:focus-visible {
		box-shadow: none;
		outline: 2px solid var(--Interaction-Focus-keyboard);
	}
}

.controlBtnPrev {
	:global(.is_ltr) & {
		left: 10px;
	}

	:global(.is_rtl) & {
		right: 10px;

		:global(.icon) {
			transform: rotateY(180deg);
		}
	}
}

.controlBtnNext {
	:global(.is_ltr) & {
		right: 10px;
	}

	:global(.is_rtl) & {
		left: 10px;

		:global(.icon) {
			transform: rotateY(180deg);
		}
	}
}

</style>