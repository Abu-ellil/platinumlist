<template>
	<HidingAnimation>
		<div :class="$style.group" v-if="!isHidden" >
			<div :class="$style.head">
				<div :class="$style.name">{{ name }}</div>
				<MoreInfoControl
					v-if="description"
					:name="name"
					:description="description"
					:galleryImageList="galleryImageList"
				>
					<SvgIcon icon="i-circled-3"/>
					<T text='_MORE_INFO_'/>
				</MoreInfoControl>
			</div>
			<slot></slot>
		</div>
	</HidingAnimation>
</template>

<script>

import T from '@vue/t';
import SvgIcon from '@vue/svg-icon';
import MoreInfoControl from '@vue/ticket-office/casual/components/more-info/control';
import HidingAnimation from '@vue/hiding-animation';

export default {
	components: {
		T,
		SvgIcon,
		HidingAnimation,
		MoreInfoControl,
	},
	props: [
		'name',
		'description',
		'isHidden',
		'galleryImageList',
		'isGroupedModeEnabled'
	],
};

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.group {
	padding: 16px;
	border: 1px solid var(--Bg-border);
	border-radius: 10px;
	@media (min-width: $media-sm) {
		padding: 24px;
		border-radius: 16px;
	}
}

.head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	gap: 12px;
	@media (min-width: $media-sm) {
		margin-bottom: 16px;
		gap: 24px;
	}
}

.name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	white-space: break-spaces;
	text-overflow: ellipsis;
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 20px;
	color: var(--Content-primary);
	@media (min-width: $media-sm) {
		line-height: 22px;
		flex: 1 0 0;
	}
}

</style>