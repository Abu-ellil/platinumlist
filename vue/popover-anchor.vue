<template>
	<Component
			:is="$props.tag ?? 'div'"
			:class="$props.class || $style.anchor"
			:style="$props.style || {}"
			data-vue-popover-anchor
		>
		<slot></slot>
	</Component>
</template>

<script setup>

import { defineProps } from 'vue';

const props = defineProps([
	'class',
	'style',
	'tag'
]);

</script>

<style lang="scss" module>

.anchor {
	display: inline-block;
}

</style>