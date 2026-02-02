<template>
	<OfferGroupFilter
		v-if="eventOfferGroupFilterList.length"
		:activeFilterId="activeFilterId"
		@apply="filterApply"
		@clear="filterClear"
	/>
	<HidingAnimation @afterLeave="afterLeaveAnimation" @beforeLeave="beforeLeaveAnimation">
		<div v-if="!isNullState" :class="$style.offerTree">
			<OfferSection
				v-for="section in offerTree['sectionList']"
				:key="section['idEventOfferSection']"
				:name="section.name"
				:description="section.description"
				:moreInfoTitle="section['moreInfoTitle']"
				:galleryImageList="section['galleryImageList']"
				:hasToggle="hasToggle"
				:isHidden="isHiddenSection(section['idEventOfferSection'])"
				:isFolded="section['isFolded']"
				:groupList = "section['groupList']"
				:price = "section['price']"
				:offerCount = "section['offerCount']"
			>
				<OfferGroup
					v-for="group in section['groupList']"
					:key="section['idEventOfferGroup']"
					:name="group.name"
					:description="group.description"
					:isHidden="isHiddenGroup(group['idEventOfferGroup'])"
					:galleryImageList="group['galleryImageList']"
				>
					<template v-if="isGroupedModeEnabled(group)">
						<GroupedOffer
							:idEventOfferGroup="group['idEventOfferGroup']"
							:offerList="group['offerList']"
							:hiddenPriceMode="group['hiddenPriceMode']"
							:ageLimit="group['ageLimit']"
							:crossedPrice="group['crossedPrice']"
							:price="group['price']"
							:discountAccelerateName="group['discountAccelerateName']"
							:customAccelerateText="group['customAccelerateText']"
						></GroupedOffer>
					</template>
					<template v-else>
						<div :class="$style.offerList">
							<Offer
								v-for="offer in group['offerList']"
								:key="`${offer['idEventOffer']}_${Number(offer['isResale'])}`"
								:offer="offer"
							></Offer>
						</div>
					</template>
				</OfferGroup>
			</OfferSection>
		</div>
	</HidingAnimation>
	<NullState
		v-if="isNullState && !isAnimating"
		:text="!isNoOfferForFilterMsg ? '_SELECT_DATE_AND_TIME_TO_CONTINUE_' : '_OFFER_GROUP_FILTER_EMPTY_TEXT_'"
		:class="nullStateClass"
	/>
</template>

<script>

import App from 'app';
import Messenger from 'messenger';
import { computed, ref, watch } from 'vue';
import { useStore } from '@vue/ticket-office/casual/store';
import Offer from '@vue/ticket-office/casual/components/offer-list/offer';
import GroupedOffer from '@vue/ticket-office/casual/components/offer-list/grouped-offer';
import NullState from '@vue/ticket-office/casual/components/offer-list/null-state';
import OfferGroup from '@vue/ticket-office/casual/components/offer-list/offer-group';
import OfferSection from '@vue/ticket-office/casual/components/offer-list/offer-section';
import OfferGroupFilter from '@vue/ticket-office/casual/components/offer-list/offer-group-filter';
import HidingAnimation from '@vue/hiding-animation';
import { useFilter } from '@vue/ticket-office/casual/composable/useFilter';
import { useApi } from '@vue/ticket-office/casual/composable/useApi';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';

export default {
	components: {
		Offer,
		GroupedOffer,
		NullState,
		OfferGroup,
		OfferSection,
		OfferGroupFilter,
		HidingAnimation,
	},
	setup() {
		const store = useStore();
		const api = useApi();
		const offerTree = computed(() => store.offerTree);
		const hasToggle = computed(() => offerTree.value['sectionList'].length > 1);
		const nullStateClass = ref('');
		const isAnimating = ref(false);
		const basket = useBasket();
		const beforeLeaveAnimation = () => isAnimating.value = true;
		const afterLeaveAnimation = () => isAnimating.value = false;
		const nullStateShake = () => {
			nullStateClass.value = '';
			setTimeout(() => nullStateClass.value = 'casual-null-state--horizontal-shake', 0)
		};
		const isGroupedModeEnabled = group => (
			group['isGroupOffer']
			&& !group['hasAutoSeatedMapZones']
			&& group['mapZoneSvgCount'] === group['offerList'].length
			&& group['offerList'].length > 1
			&& group['isSeatSelectionModeManual']
			&& !group['offerList'].filter($offer => $offer['hasForceAutoSeating']).length
			&& !group['offerList'].filter($offer => $offer['isVoucher']).length
			&& !group['offerList'].filter($offer => $offer['isPackage']).length
		);
		const {
			eventOfferGroupFilterList,
			filteredSectionList,
			filteredGroupList,
			activeFilterId,
			isNoOfferForFilterMsg,
			isHiddenSection,
			isHiddenGroup,
			filterClear,
			filterApply,
		} = useFilter({
			onEmpty: nullStateShake,
			onApply: () => nullStateClass.value = '',
		});
		const isNullState = computed(() => {
			if ((offerTree.value['sectionList'] || []).length === 0) {
				return true;
			}

			return offerTree.value['sectionList'].length === filteredSectionList.value.length;
		});

		return {
			offerTree,
			hasToggle,
			isNoOfferForFilterMsg,
			isNullState,
			nullStateClass,
			eventOfferGroupFilterList,
			activeFilterId,
			isHiddenSection,
			isHiddenGroup,
			filteredSectionList,
			filteredGroupList,
			filterApply,
			filterClear,
			isAnimating,
			nullStateShake,
			beforeLeaveAnimation,
			afterLeaveAnimation,
			isGroupedModeEnabled,
		};
	},
};

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.offerTree {
	display: flex;
	flex-direction: column;
	gap: 32px;
}

.offerList {
	display: flex;
	flex-direction: column;
	gap: 12px;
	@media (min-width: $media-sm) {
		gap: 16px;
	}
}

</style>