<template>
	<li :class="$style.optionListItem">
		<button
			:class="{
				[$style.optionListItemBtn]: true,
				[$style.optionListItemBtnActive]: Number(item.idEventSession) === Number(idEventSession),
				[$style.optionListItemBtnReduced]: !hasManyDates,
				[$style.optionListItemBtnRangeMode]: item.isShowTimeInRangeMode,
				[$style.optionListItemBtnSoldOut]: item.isSoldOut,
			}"
			:ref="(el) => setActiveOptionRef(el, Number(item.idEventSession) === Number(idEventSession))"
			@click="selectOption(item.idEventShow, item.idEventSession)"
		>
			<span :class="$style.optionListItemText">
				<template v-if="hasManyDates">
					{{ moment(item.date).format('ddd DD MMM') }},
					{{item.timeRange}}
				</template>
				<template v-else>
					{{item.timeRange}}
				</template>
			</span>
			<template v-if="item.isSoldOut">
				<span :class="$style.optionListItemSoldOutText">
					<T text="_SOLD_OUT_" />
				</span>
			</template>
			<template v-else>
				<span :class="$style.optionListItemCheckmark">
					<SvgIcon icon="16-kit-checkmark"/>
				</span>
			</template>
		</button>
	</li>
</template>

<script setup>

import moment from 'moment';
import SvgIcon from '@vue/svg-icon';
import T from '@vue/t';
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits([
	'selectOption',
	'setActiveOptionRef',
]);

const props = defineProps([
	'item',
	'idEventSession',
	'hasManyDates',
]);

const selectOption = (selectedIdEventShow, selectedIdEventSession) => {
	emit('selectOption', selectedIdEventShow, selectedIdEventSession);
}

const setActiveOptionRef = (el, isActive) => {
	if (isActive) {
		emit('setActiveOptionRef', el);
	}
}

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.optionListItem {
	display: flex;
	padding: 2px;
}

.optionListItemBtn {
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	gap: 6px;
	box-sizing: border-box;
	border-radius: 12px;
	border: 1px solid var(--Bg-border);
	background: var(--Bg-default);
	padding: 11px 12px 11px 16px;

	:global(.is_ltr) & {
		min-width: 220px;
	}

	:global(.is_rtl) & {
		min-width: 240px;
	}

	&:focus-visible {
		box-shadow: none;
		outline: 2px solid var(--Interaction-Focus-keyboard);
	}

	@media (min-width: $media-sm) {
		&:hover:not(.optionListItemBtnActive):not(.optionListItemBtnSoldOut) {
			.optionListItemText {
				transition: all 120ms ease-out;
				color: var(--Interaction-Secondary-content);
			}
		}
	}
}

.optionListItemBtnSoldOut {
	&:hover {
		cursor: default;
	}

	.optionListItemText {
		color: var(--Interaction-Disable-content);
		flex: 0 1 auto;
	}
}

.optionListItemBtnActive {
	color: var(--Interaction-Secondary-content);

	.optionListItemCheckmark {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
	}
}

.optionListItemBtn.optionListItemBtnRangeMode {
	:global(.is_ltr) & {
		min-width: 240px;
	}

	:global(.is_rtl) & {
		min-width: 260px;
	}
}

.optionListItemBtnReduced {
	:global(.is_ltr) &,
	:global(.is_rtl) & {
		min-width: 120px;
	}
}

.optionListItemBtnReduced.optionListItemBtnRangeMode {
	:global(.is_ltr) &,
	:global(.is_rtl) & {
		min-width: 140px;
	}
}

.optionListItemText {
	display: flex;
	flex: 1 1 auto;
}

.optionListItemSoldOutText {
	font-size: 14px;
	color: var(--Accent-alert);
}

.optionListItemCheckmark {
	display: none;
	width: 24px;
	height: 24px;
	background-color: var(--Bg-ghost);
	border-radius: 50%;

	:global(.icon) {
		width: 16px;
		height: 16px;
		fill: var(--Interaction-Secondary-content);
	}
}

</style>