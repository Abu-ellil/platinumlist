<template>
	<Mobile>
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
				<ul
					:class="$style.optionList"
					ref="optionListRef"
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
	</Mobile>
</template>

<script setup>

import Confirm from '@vue/ticket-office/casual/components/common/confirm';
import TimeOption from '@vue/ticket-office/casual/components/time-options/internal/time-option';
import UnitedTimeOption from '@vue/ticket-office/casual/components/time-options/internal/united-time-option';
import DatePickerBtn from '@vue/ticket-office/casual/components/time-options/internal/date-picker-btn';
import Mobile from '@vue/mobile';
import { defineEmits, onMounted, watch } from 'vue';
import { useShowByDateMap } from '@vue/ticket-office/casual/composable/useShowByDateMap';
import { useEventInfo } from '@vue/ticket-office/casual/composable/useEventInfo';
import { useEventSession } from '@vue/ticket-office/casual/composable/useEventSession';
import { useGTM } from '@vue/ticket-office/casual/composable/useGTM';
import { useTimeOptions } from '@vue/ticket-office/casual/components/time-options/internal/useTimeOptions';
import { useMobileAnimation } from '@vue/ticket-office/casual/components/time-options/internal/useMobileAnimation';

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
} = useTimeOptions();

const {
	activeOptionRef,
	optionListRef,
	datePickerBtnRef,
	optionsRowRef,
	syncOptionListScroll,
} = useMobileAnimation();

const { idEventSession } = useEventSession();
const { selectedOptionDateTime } = useEventInfo();
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
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.optionsRow {
	display: flex;
	gap: 8px;
	align-items: center;
}

.optionList {
	position: relative;
	display: flex;
	gap: 4px;
	overflow-y: scroll;
	scroll-behavior: smooth;
	margin: 0 -20px;
	padding: 0 20px;

	&::-webkit-scrollbar {
		display: none;
	}
}

</style>