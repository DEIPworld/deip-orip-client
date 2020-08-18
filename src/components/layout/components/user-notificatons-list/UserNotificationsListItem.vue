<template>
  <v-list-item @click="clickNotification(notification)">
    <v-list-item-content>
      <div class="mb-2 text-body-2">
        <slot />
      </div>
      <v-row justify="space-between" align="end">
        <v-col class="grey--text caption">
          <v-icon size="16" color="grey">
            event
          </v-icon> {{ new Date(date).toDateString() }}
        </v-col>
        <v-col cols="auto">
          <a class="a orange--text caption" @click="$emit('mark-as-read')">Mark as read</a>
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: 'UserNotificationsListItem',
    props: {
      date: {
        type: String,
        default: new Date()
      }
    }
  };
</script>

<style scoped>

</style>
