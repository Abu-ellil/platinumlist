<template>
	<button>
		<template v-if="idEventShow || isCalendarVisible">
			<a
				:class="$style.link"
				:href="'javascript:void(0)'"
				@click="$emit('backBtnClick')"
			>
				<SvgIcon icon="arrow-left-rounded"/>
				<NoMobile>
					<T text="_BACK_"/>
				</NoMobile>
			</a>
		</template>
		<template v-else-if="isB2c">
			<a
				:class="$style.link"
				:href="'javascript:void(0)'"
				data-b2c-casual-ticket-office-back
			>
				<SvgIcon icon="arrow-left-rounded"/>
				<NoMobile>
					<T text="_BACK_"/>
				</NoMobile>
			</a>
		</template>
		<template v-else>
			<a :class="$style.link"
			   :href="backUrl"
			>
				<SvgIcon icon="arrow-left-rounded"/>
				<NoMobile>
					<T text="_BACK_"/>
				</NoMobile>
			</a>
		</template>
	</button>
</template>

<script setup>

import { computed, defineProps } from 'vue';
import T from '@vue/t';
import SvgIcon from '@vue/svg-icon';
import NoMobile from '@vue/no-mobile';

const props = defineProps([
	'backUrl',
	'scope',
	'idEventShow',
	'isCalendarVisible',
])
const isB2c = computed(() => props.scope === 'b2c');

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.link {
	display: flex;
	align-items: center;
	font-size: 16px;
	line-height: 24px;
	color: var(--Content-primary);
	padding: 9px;
	border-radius: 24px;
	border: 1px solid var(--Bg-border);
	background-color: var(--Bg-default);
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08), 0 0 2px 0 rgba(0, 0, 0, 0.06);
	transition: all 120ms ease-out;

	&:focus-visible {
		outline: 2px solid var(--Interaction-Focus-keyboard);
	}

	&:hover {
		color: var(--Interaction-Secondary-content);
		:global(.icon) {
			stroke: var(--Interaction-Secondary-content);
		}
	}

	:global(svg.icon) {
		width: 24px;
		height: 24px;
		stroke: var(--Content-secondary);
		transition: all 120ms ease-out;

		&:hover {
			stroke: var(--Interaction-Secondary-content);
		}

		:global(.is_rtl) & {
			transform: rotate(180deg);
		}
	}

	@media (min-width: $media-sm) {
		gap: 8px;

		:global(.is_ltr) & {
			padding: 9px 24px 9px 12px;
		}

		:global(.is_rtl) & {
			padding: 9px 12px 9px 24px;
		}
	}
}

</style>